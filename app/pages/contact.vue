<script setup lang="ts">
import { Phone, MessageCircle, Mail, MapPin } from '@lucide/vue'
import { contact } from '~/data/company'

useHead({
  title: 'Contact Us — Third Creek Auto Spares',
  meta: [
    {
      name: 'description',
      content: 'Get in touch with Third Creek Auto Spares in Lusaka, Zambia by phone, WhatsApp, email or in person.',
    },
  ],
})
</script>

<template>
  <div>
    <HeroBand size="sm" eyebrow="Contact" title="We're here to help you find the right part." />

    <section class="py-16 sm:py-20 bg-canvas">
      <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <SectionHeading eyebrow="Get In Touch" title="Send us an enquiry" />
          <div class="mt-8">
            <ContactForm />
          </div>
        </div>

        <div>
          <SectionHeading eyebrow="Reach Us Directly" title="Call, WhatsApp or visit" />

          <div class="mt-8 flex flex-wrap gap-4 mb-10">
            <a :href="`tel:+${contact.phonePrimaryIntl}`" class="btn-primary inline-flex items-center gap-2">
              <Phone :size="16" />
              Call {{ contact.phonePrimary }}
            </a>
            <a
              :href="`https://wa.me/${contact.phonePrimaryIntl}`"
              target="_blank"
              rel="noopener"
              class="btn-secondary inline-flex items-center gap-2"
            >
              <MessageCircle :size="16" />
              WhatsApp Us
            </a>
          </div>

          <div class="space-y-3 mb-10">
            <p class="text-[14px] text-body flex items-center gap-2">
              <Phone :size="15" class="text-primary shrink-0" />
              <a :href="`tel:+${contact.phonePrimaryIntl}`" class="hover:text-primary">{{ contact.phonePrimary }}</a>
              <span>/</span>
              <a :href="`tel:+260${contact.phoneSecondary.slice(1)}`" class="hover:text-primary">{{ contact.phoneSecondary }}</a>
            </p>
            <p class="text-[14px] text-body flex items-center gap-2">
              <Mail :size="15" class="text-primary shrink-0" />
              <a :href="`mailto:${contact.email}`" class="hover:text-primary">{{ contact.email }}</a>
            </p>
          </div>

          <p class="label-uppercase text-muted mb-4">Our Locations</p>
          <div class="space-y-4">
            <div v-for="loc in contact.locations" :key="loc.name" class="border-l-2 border-primary pl-4">
              <p class="font-display font-bold text-ink flex items-center gap-2">
                <MapPin :size="15" class="text-primary shrink-0" />
                {{ loc.name }}
              </p>
              <p class="text-[14px] text-body font-light">{{ loc.address }}</p>
            </div>
          </div>

          <div class="mt-10 aspect-[16/9] bg-surface-card flex items-center justify-center border border-hairline">
            <p class="text-[13px] text-muted">Map preview placeholder</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
