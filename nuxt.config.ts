import { existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

// libsql ships its native binary as a separate platform-specific optional dependency
// (e.g. @libsql/linux-x64-musl). It's required dynamically at runtime, so Nitro's
// build-time file tracer can't follow it — without this, it's silently missing from
// .output/server/node_modules and the deployed app crashes with
// "Cannot find module '@libsql/<platform>'". Force-include whichever native variant
// is actually installed (works the same on any dev machine and any deploy target).
function libsqlNativeTraceIncludes() {
  const dir = fileURLToPath(new URL('./node_modules/@libsql', import.meta.url))
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((name) => /^(linux|darwin|win32)-/.test(name))
    .flatMap((name) => [`node_modules/@libsql/${name}/package.json`, `node_modules/@libsql/${name}/index.node`])
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  nitro: {
    externals: {
      traceInclude: libsqlNativeTraceIncludes(),
    },
  },

  typescript: {
    strict: true,
  },

  app: {
    head: {
      title: 'Third Creek Auto Spares',
      htmlAttrs: { lang: 'en' },
      meta: [{ name: 'theme-color', content: '#001a53' }],
      link: [
        // Modern browsers use the crisp SVG; the .ico is the fallback for older ones.
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: '32x32' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap',
        },
      ],
    },
  },
})
