<script setup lang="ts">
import { contact } from '~/data/company'

const year = new Date().getFullYear()

const columns = [
  {
    heading: 'Explore',
    links: [
      { label: 'Home', to: '/' },
      { label: 'About Us', to: '/about' },
      { label: 'Auto Spares', to: '/products' },
      { label: 'Services', to: '/services' },
    ],
  },
]
</script>

<template>
  <footer class="bg-surface-soft text-body">
    <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-16">
      <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <img src="/logo.png" alt="Third Creek Auto Spares" class="h-10 w-auto mb-4" />
          <p class="text-[14px] leading-relaxed text-muted max-w-xs">
            Genuine automotive parts and workshop support for Land Rover, Range Rover, Toyota,
            Mercedes-Benz and BMW vehicles &mdash; proudly Zambian owned.
          </p>
        </div>

        <div v-for="col in columns" :key="col.heading">
          <h3 class="label-uppercase text-ink mb-4">{{ col.heading }}</h3>
          <ul class="space-y-2">
            <li v-for="link in col.links" :key="link.to">
              <NuxtLink :to="link.to" class="text-[14px] text-muted hover:text-primary transition-colors">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="label-uppercase text-ink mb-4">Contact</h3>
          <ul class="space-y-2 text-[14px] text-muted">
            <li>
              <a :href="`tel:+${contact.phonePrimaryIntl}`" class="hover:text-primary transition-colors">{{ contact.phonePrimary }}</a>
            </li>
            <li>
              <a :href="`mailto:${contact.email}`" class="hover:text-primary transition-colors">{{ contact.email }}</a>
            </li>
            <li v-for="loc in contact.locations" :key="loc.name">{{ loc.name }}</li>
          </ul>
        </div>

        <div>
          <h3 class="label-uppercase text-ink mb-4">Get In Touch</h3>
          <a
            :href="`https://wa.me/${contact.phonePrimaryIntl}`"
            target="_blank"
            rel="noopener"
            class="btn-secondary inline-block"
          >
            WhatsApp Us
          </a>
        </div>
      </div>

      <div class="mt-12 pt-6 border-t border-hairline-strong flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p class="text-[13px] text-muted">&copy; {{ year }} Third Creek Investments Limited. All rights reserved.</p>
        <p class="text-[13px] text-muted">Third Creek Auto Spares</p>
      </div>
    </div>
  </footer>
</template>
