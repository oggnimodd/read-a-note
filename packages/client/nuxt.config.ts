import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/color-mode",
    "@nuxt/icon",
    "shadcn-nuxt",
    "@pinia/nuxt",
    "@nuxt/test-utils/module",
  ],
  colorMode: {
    classSuffix: "",
    preference: "dark",
    fallback: "dark",
  },
  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },
  icon: {
    collections: ["lucide"],
    mode: "svg",
    cssLayer: "base",
  },
  pages: {
    pattern: [
      "**/*.vue",
      "!**/components/**",
      "!**/stores/**",
      "!**/composables/**",
    ],
  },
  components: [
    "~/components",
    {
      path: "~/pages",
      pattern: "**/components/**",
      pathPrefix: false,
    },
  ],
  pinia: {
    storesDirs: ["./app/stores/**", "./app/pages/**/stores/**"],
  },
  css: ["~/assets/main.css"],
  vite: {
    plugins: [tailwindcss(), tsconfigPaths()],
  },
  nitro: {
    preset: "static",
  },
  runtimeConfig: {
    public: {
      backendUrl: process.env.NUXT_BACKEND_URL,
    },
  },
});
