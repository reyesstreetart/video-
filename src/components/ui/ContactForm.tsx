"use client";

import { useId, useState, type FormEvent } from "react";
import { siteConfig, hasValue } from "@/content/site-config";
import styles from "./ContactForm.module.css";

export interface ContactFormValues {
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
  /** Champs optionnels des démos (réservation, visite…). */
  extra?: Record<string, string>;
}

interface ContactFormProps {
  /** Identifiant du contexte (ex. "studio", "ember-oak-reservation"). */
  context: string;
  title?: string;
  submitLabel?: string;
  /** Champs supplémentaires rendus avant le message. */
  extraFields?: { name: string; label: string; type?: "text" | "date" | "number" | "time" | "select"; options?: string[]; required?: boolean; min?: number; max?: number }[];
  showBudget?: boolean;
  messageLabel?: string;
  compact?: boolean;
  /** Sujet du mailto de secours. */
  mailtoSubject?: string;
}

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success"; message: string }
  | { kind: "fallback"; message: string; mailto: string }
  | { kind: "error"; message: string; fields?: Record<string, string> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Formulaire accessible : labels, erreurs annoncées, honeypot, validation client + serveur.
 * Si aucun service e-mail n'est configuré côté serveur, l'API renvoie un fallback mailto: explicite.
 */
export function ContactForm({
  context,
  title,
  submitLabel = "Envoyer ma demande",
  extraFields = [],
  showBudget = true,
  messageLabel = "Votre projet",
  compact = false,
  mailtoSubject,
}: ContactFormProps) {
  const id = useId();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: FormData) => {
    const e: Record<string, string> = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (name.length < 2) e.name = "Indiquez votre nom.";
    if (!EMAIL_RE.test(email)) e.email = "Indiquez une adresse e-mail valide.";
    if (message.length < 10) e.message = "Décrivez votre demande en quelques mots (10 caractères minimum).";
    for (const f of extraFields) {
      if (f.required && !String(data.get(f.name) ?? "").trim()) e[f.name] = "Ce champ est requis.";
    }
    return e;
  };

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const data = new FormData(form);
    const e = validate(data);
    setErrors(e);
    if (Object.keys(e).length) {
      setStatus({ kind: "error", message: "Certains champs demandent votre attention." });
      const first = form.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }
    setStatus({ kind: "sending" });
    const payload: Record<string, unknown> = {
      context,
      name: data.get("name"),
      email: data.get("email"),
      company: data.get("company"),
      budget: data.get("budget"),
      message: data.get("message"),
      website: data.get("website"), // honeypot
      startedAt: Number(data.get("startedAt")),
      extra: Object.fromEntries(extraFields.map((f) => [f.name, String(data.get(f.name) ?? "")])),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        ok: boolean;
        message?: string;
        fallback?: "mailto";
        mailto?: string;
        fields?: Record<string, string>;
      };
      if (res.ok && json.ok) {
        setStatus({ kind: "success", message: json.message ?? "Merci, votre message a bien été envoyé." });
        form.reset();
      } else if (json.fallback === "mailto" && json.mailto) {
        setStatus({
          kind: "fallback",
          message: json.message ?? "L’envoi automatique n’est pas encore configuré.",
          mailto: json.mailto,
        });
      } else {
        if (json.fields) setErrors(json.fields);
        setStatus({ kind: "error", message: json.message ?? "Une erreur est survenue. Réessayez dans un instant." });
      }
    } catch {
      const to = hasValue(siteConfig.contact.email) ? siteConfig.contact.email : "";
      if (to) {
        setStatus({
          kind: "fallback",
          message: "Le serveur ne répond pas. Vous pouvez nous écrire directement.",
          mailto: `mailto:${to}?subject=${encodeURIComponent(mailtoSubject ?? "Projet MV Design")}`,
        });
      } else {
        setStatus({ kind: "error", message: "Le serveur ne répond pas. Réessayez dans un instant." });
      }
    }
  };

  const f = (name: string) => `${id}-${name}`;

  return (
    <form className={[styles.form, compact ? styles.compact : ""].join(" ")} onSubmit={onSubmit} noValidate aria-describedby={`${id}-status`}>
      {title ? <h3 className="h3">{title}</h3> : null}
      <input type="hidden" name="startedAt" value={String(Date.now())} readOnly />
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={f("website")}>Site web</label>
        <input id={f("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className={styles.row}>
        <div className="field">
          <label htmlFor={f("name")}>Nom *</label>
          <input id={f("name")} name="name" type="text" autoComplete="name" required aria-invalid={errors.name ? "true" : undefined} aria-describedby={errors.name ? f("name-err") : undefined} />
          {errors.name ? (
            <p id={f("name-err")} className="field-error">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className="field">
          <label htmlFor={f("email")}>E-mail *</label>
          <input id={f("email")} name="email" type="email" autoComplete="email" required aria-invalid={errors.email ? "true" : undefined} aria-describedby={errors.email ? f("email-err") : undefined} />
          {errors.email ? (
            <p id={f("email-err")} className="field-error">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>
      {showBudget ? (
        <div className={styles.row}>
          <div className="field">
            <label htmlFor={f("company")}>Marque ou entreprise</label>
            <input id={f("company")} name="company" type="text" autoComplete="organization" />
          </div>
          <div className="field">
            <label htmlFor={f("budget")}>Budget envisagé</label>
            <select id={f("budget")} name="budget" defaultValue="">
              <option value="">À définir ensemble</option>
              <option value="< 10 k€">Moins de 10 k€</option>
              <option value="10–25 k€">10 à 25 k€</option>
              <option value="25–60 k€">25 à 60 k€</option>
              <option value="> 60 k€">Plus de 60 k€</option>
            </select>
          </div>
        </div>
      ) : null}
      {extraFields.length ? (
        <div className={styles.row}>
          {extraFields.map((x) => (
            <div className="field" key={x.name}>
              <label htmlFor={f(x.name)}>
                {x.label}
                {x.required ? " *" : ""}
              </label>
              {x.type === "select" ? (
                <select id={f(x.name)} name={x.name} defaultValue="" aria-invalid={errors[x.name] ? "true" : undefined}>
                  <option value="">Choisir</option>
                  {(x.options ?? []).map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input id={f(x.name)} name={x.name} type={x.type ?? "text"} min={x.min} max={x.max} aria-invalid={errors[x.name] ? "true" : undefined} aria-describedby={errors[x.name] ? f(`${x.name}-err`) : undefined} />
              )}
              {errors[x.name] ? (
                <p id={f(`${x.name}-err`)} className="field-error">
                  {errors[x.name]}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
      <div className="field">
        <label htmlFor={f("message")}>{messageLabel} *</label>
        <textarea id={f("message")} name="message" required aria-invalid={errors.message ? "true" : undefined} aria-describedby={errors.message ? f("message-err") : undefined} />
        {errors.message ? (
          <p id={f("message-err")} className="field-error">
            {errors.message}
          </p>
        ) : null}
      </div>
      <div className={styles.actions}>
        <button type="submit" className="btn btn--primary" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Envoi en cours…" : submitLabel}
        </button>
        <p className={styles.micro}>{siteConfig.responseTime}</p>
      </div>
      <div id={`${id}-status`} role="status" aria-live="polite" className={styles.status}>
        {status.kind === "success" ? <p className="form-status form-status--ok">{status.message}</p> : null}
        {status.kind === "error" ? <p className="form-status form-status--error">{status.message}</p> : null}
        {status.kind === "fallback" ? (
          <div className="form-status">
            <p>{status.message}</p>
            <p>
              <a href={status.mailto} className="link-arrow">
                Ouvrir mon client e-mail
              </a>
            </p>
          </div>
        ) : null}
      </div>
    </form>
  );
}
