<script setup lang="ts">
import { MessageCircle, Phone } from '@lucide/vue'
import { contact } from '~/data/company'

withDefaults(
  defineProps<{
    title: string
    subtitle?: string
  }>(),
  {},
)
</script>

<template>
  <section class="bg-surface-dark text-on-dark">
    <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-16 sm:py-20 text-center">
      <h2 class="font-display font-bold text-2xl sm:text-3xl max-w-2xl mx-auto">{{ title }}</h2>
      <p v-if="subtitle" class="font-body font-light text-on-dark-soft mt-4 max-w-xl mx-auto">{{ subtitle }}</p>
      <div class="mt-8 flex flex-wrap justify-center gap-4">
        <a
          :href="`https://wa.me/${contact.phonePrimaryIntl}`"
          target="_blank"
          rel="noopener"
          class="btn-primary inline-flex items-center gap-2"
        >
          <MessageCircle :size="16" />
          WhatsApp Us
        </a>
        <a :href="`tel:+${contact.phonePrimaryIntl}`" class="btn-secondary-on-dark inline-flex items-center gap-2">
          <Phone :size="16" />
          Call {{ contact.phonePrimary }}
        </a>
      </div>
    </div>
  </section>
</template>
