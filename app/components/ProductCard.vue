<script setup lang="ts">
import { MessageCircle } from '@lucide/vue'
import type { Product } from '~/data/products'
import { contact } from '~/data/company'

const props = defineProps<{ product: Product }>()

const enquiryHref = computed(() => {
  const message = encodeURIComponent(`Hi Third Creek Auto Spares, I'd like to enquire about: ${props.product.name}`)
  return `https://wa.me/${contact.phonePrimaryIntl}?text=${message}`
})
</script>

<template>
  <article class="bg-canvas p-6 flex flex-col h-full">
    <div class="aspect-[16/10] bg-surface-card flex items-center justify-center mb-6 overflow-hidden">
      <img :src="product.image" :alt="product.name" class="h-full w-full object-cover" loading="lazy" />
    </div>

    <div class="flex flex-wrap gap-2 mb-3">
      <span class="text-[11px] tracking-wide uppercase font-bold px-2 py-1 bg-surface-strong text-ink">{{ product.brand }}</span>
      <span class="text-[11px] tracking-wide uppercase font-bold px-2 py-1 border border-hairline-strong text-muted">{{ product.category }}</span>
    </div>

    <h3 class="font-display font-bold text-lg text-ink mb-2">{{ product.name }}</h3>
    <p class="font-body font-light text-[14px] text-body leading-relaxed mb-5 flex-1">{{ product.blurb }}</p>

    <a :href="enquiryHref" target="_blank" rel="noopener" class="text-link-cta">
      <MessageCircle :size="14" />
      Enquire
    </a>
  </article>
</template>
