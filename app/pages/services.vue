<script setup lang="ts">
import { services } from '~/data/services'

useHead({
  title: 'Workshop & Mechanic Services — Third Creek Auto Spares',
  meta: [
    {
      name: 'description',
      content:
        'Third Creek Auto Spares offers workshop and mechanic services including diagnostics, brake service, suspension work, oil changes and special parts ordering.',
    },
  ],
})
</script>

<template>
  <div>
    <HeroBand
      size="sm"
      eyebrow="Workshop"
      title="Mechanic services from a team that knows these vehicles."
      subtitle="Backed by 20+ years of hands-on experience across Land Rover, Toyota, Mercedes-Benz and BMW."
    />

    <section class="py-16 sm:py-20 bg-canvas">
      <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard v-for="service in services" :key="service.id" :service="service" />
        </div>
      </div>
    </section>

    <section class="py-16 sm:py-20 bg-surface-soft">
      <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading eyebrow="Orders" title="On-demand stock and special orders" align="center" />
        <div class="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
          <div class="bg-canvas p-6 border border-hairline">
            <p class="font-display font-bold text-2xl text-primary mb-2">On Demand</p>
            <p class="text-[14px] text-body font-light">Service kits, oil filters, air cleaners, fuel filters and engine lubricants kept in stock.</p>
          </div>
          <div class="bg-canvas p-6 border border-hairline">
            <p class="font-display font-bold text-2xl text-primary mb-2">3 Months</p>
            <p class="text-[14px] text-body font-light">Maximum lead time for special orders outside our regular stock.</p>
          </div>
          <div class="bg-canvas p-6 border border-hairline">
            <p class="font-display font-bold text-2xl text-primary mb-2">7 Days</p>
            <p class="text-[14px] text-body font-light">Maximum lead time for emergency orders, in business days.</p>
          </div>
        </div>
      </div>
    </section>

    <CtaBand
      title="Book a service or ask about a part."
      subtitle="Reach our team directly by call or WhatsApp and we'll take it from there."
    />
  </div>
</template>
