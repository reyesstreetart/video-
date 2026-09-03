import { NextResponse } from "next/server";
import { siteConfig, hasValue } from "@/content/site-config";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX = Number(process.env.CONTACT_RATE_LIMIT_MAX ?? 5);
const WINDOW = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS ?? 600_000);

/** Limitation de requêtes en mémoire (par instance). Remplacer par un store partagé en multi-instances. */
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (list.length >= MAX) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return false;
}

interface Payload {
  context?: string;
  name?: string;
  email?: string;
  company?: string;
  budget?: string;
  message?: string;
  website?: string;
  startedAt?: number;
  extra?: Record<string, string>;
}

const clean = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, message: "Trop de demandes. Réessayez dans quelques minutes." }, { status: 429 });
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, message: "Requête invalide." }, { status: 400 });
  }

  // Honeypot : un robot remplit le champ caché → on répond OK sans rien faire.
  if (clean(body.website)) {
    return NextResponse.json({ ok: true, message: "Merci, votre message a bien été envoyé." });
  }
  // Envoi trop rapide (< 2 s après affichage) : probable automate.
  if (typeof body.startedAt === "number" && Date.now() - body.startedAt < 2000) {
    return NextResponse.json({ ok: false, message: "Merci de prendre un instant avant d’envoyer." }, { status: 400 });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const message = clean(body.message, 4000);
  const company = clean(body.company, 200);
  const budget = clean(body.budget, 50);
  const context = clean(body.context, 80) || "studio";
  const extra: Record<string, string> = {};
  if (body.extra && typeof body.extra === "object") {
    for (const [k, v] of Object.entries(body.extra).slice(0, 12)) extra[clean(k, 40)] = clean(v, 200);
  }

  const fields: Record<string, string> = {};
  if (name.length < 2) fields.name = "Indiquez votre nom.";
  if (!EMAIL_RE.test(email)) fields.email = "Indiquez une adresse e-mail valide.";
  if (message.length < 10) fields.message = "Décrivez votre demande (10 caractères minimum).";
  if (Object.keys(fields).length) {
    return NextResponse.json({ ok: false, message: "Certains champs demandent votre attention.", fields }, { status: 422 });
  }

  const subject = `[MV Design · ${context}] ${name}`;
  const lines = [
    `Nom : ${name}`,
    `E-mail : ${email}`,
    company ? `Entreprise : ${company}` : null,
    budget ? `Budget : ${budget}` : null,
    ...Object.entries(extra).map(([k, v]) => (v ? `${k} : ${v}` : null)),
    "",
    message,
  ].filter((l): l is string => l !== null);
  const text = lines.join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || siteConfig.contact.email;
  const from = process.env.CONTACT_FROM_EMAIL || "MV Design <onboarding@resend.dev>";

  if (!apiKey || !hasValue(to)) {
    // Aucun service configuré : ne pas simuler un succès, proposer un fallback mailto: explicite.
    const mailtoTarget = hasValue(to) ? to : "";
    const mailto = mailtoTarget ? `mailto:${mailtoTarget}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}` : "";
    return NextResponse.json(
      {
        ok: false,
        fallback: mailto ? "mailto" : undefined,
        mailto: mailto || undefined,
        message: mailto
          ? "L’envoi automatique n’est pas encore configuré. Votre message est prêt : ouvrez votre client e-mail pour nous l’envoyer directement."
          : "L’envoi automatique n’est pas encore configuré sur ce site (service e-mail et adresse de destination à renseigner).",
      },
      { status: 503 },
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject, text }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}`);
    return NextResponse.json({ ok: true, message: "Merci, votre message a bien été envoyé. Nous revenons vers vous sous 48 heures ouvrées." });
  } catch (e) {
    console.error("[contact] envoi impossible", e);
    return NextResponse.json({ ok: false, message: "L’envoi a échoué. Réessayez dans un instant." }, { status: 502 });
  }
}
