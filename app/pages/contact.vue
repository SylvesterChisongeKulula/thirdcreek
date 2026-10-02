<script setup lang="ts">
import { Phone, MessageCircle, Mail, MapPin, Navigation } from '@lucide/vue'
import { contact, mapDirectionsUrl, mapEmbedUrl } from '~/data/company'

const selectedName = ref(contact.locations.find((loc) => loc.main)?.name ?? contact.locations[0]!.name)
const selected = computed(() => contact.locations.find((loc) => loc.name === selectedName.value) ?? contact.locations[0]!)

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

          <p class="label-uppercase text-muted mb-1">Our Locations</p>
          <p class="text-[13px] text-muted mb-4">Select a branch to see it on the map.</p>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              v-for="loc in contact.locations"
              :key="loc.name"
              type="button"
              class="border border-l-4 px-4 py-3 text-left transition-colors"
              :class="
                loc.name === selectedName
                  ? 'border-primary bg-primary/5'
                  : 'border-hairline border-l-hairline-strong hover:border-ink hover:border-l-ink'
              "
              :aria-pressed="loc.name === selectedName"
              @click="selectedName = loc.name"
            >
              <span class="font-display font-bold text-ink flex items-center gap-2">
                <MapPin :size="15" class="text-primary shrink-0" />
                {{ loc.name }}
              </span>
              <span v-if="loc.main" class="mt-1 inline-block bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-on-primary">
                Main branch
              </span>
              <span class="mt-1 block text-[13px] text-body font-light">{{ loc.address }}</span>
            </button>
          </div>

          <div class="mt-6 aspect-[16/9] border border-hairline bg-surface-card">
            <iframe
              :key="selected.name"
              :src="mapEmbedUrl(selected.map)"
              :title="`Map showing Third Creek Auto Spares, ${selected.name}`"
              class="h-full w-full"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              allowfullscreen
            />
          </div>
          <div class="mt-3 flex flex-wrap items-center justify-between gap-2">
            <a
              :href="mapDirectionsUrl(selected.map)"
              target="_blank"
              rel="noopener"
              class="text-link-cta"
            >
              <Navigation :size="14" /> Get directions to {{ selected.name }} →
            </a>
            <p v-if="selected.map.approximate" class="text-[13px] text-muted">
              Showing the {{ selected.name }} area — exact pin coming soon.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
