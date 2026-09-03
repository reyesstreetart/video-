import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [".next/**", "out/**", "node_modules/**", "playwright-report/**", "test-results/**"],
  },
  {
    rules: {
      // Les médias sont déjà des WebP/AVIF optimisés, servis avec art direction (<picture> + source mobile)
      // et chargés selon le mode de mouvement. next/image n'apporte rien ici et casserait le cache immutable.
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
