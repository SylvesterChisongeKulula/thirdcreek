<script setup lang="ts">
import { products } from '~/data/products'
import { services } from '~/data/services'
import { contact } from '~/data/company'
import { supportedBrands } from '~/data/brands'

useHead({
  title: 'Third Creek Auto Spares — Genuine Auto Parts in Lusaka, Zambia',
  meta: [
    {
      name: 'description',
      content:
        'Third Creek Auto Spares supplies genuine Land Rover, Range Rover, Toyota, Mercedes-Benz and BMW auto parts, plus workshop and mechanic services in Lusaka, Zambia.',
    },
  ],
})

const featuredProducts = products.slice(0, 4)
const featuredServices = services.slice(0, 3)
</script>

<template>
  <div>
    <HeroBand
      eyebrow="Third Creek Auto Spares"
      title="Genuine auto parts, sourced right and fitted with expertise."
      subtitle="We supply and support genuine spares for Land Rover, Range Rover, Toyota, Mercedes-Benz and BMW vehicles — backed by 20+ years of hands-on motor industry experience."
      image="/images/stock/home-hero.jpg"
      image-alt="Vehicle undergoing maintenance in a modern workshop"
    >
      <NuxtLink to="/products" class="btn-primary">Browse Parts</NuxtLink>
      <NuxtLink to="/contact" class="btn-secondary-on-dark">Contact Us</NuxtLink>
    </HeroBand>

    <section class="py-16 sm:py-20 bg-canvas">
      <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <p class="label-uppercase text-muted text-center mb-6">Brands We Supply</p>
        <div class="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          <div v-for="brand in supportedBrands" :key="brand.name" class="flex items-center gap-3">
            <img :src="brand.logo" :alt="`${brand.name} logo`" class="h-10 w-10 object-contain shrink-0" loading="lazy" />
            <span class="font-display font-bold text-xl text-ink">{{ brand.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 sm:py-20 bg-surface-soft">
      <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="A team that treats your vehicle like it matters."
          subtitle="Founded by a specialist mechanic with two decades of experience across Toyota, Jaguar Land Rover and John Deere in Zambia and the United States."
        />
        <div class="mt-8">
          <TrustBadgeRow />
        </div>
      </div>
    </section>

    <section class="py-16 sm:py-20 bg-canvas">
      <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div class="flex flex-wrap items-end justify-between gap-4 mb-10">
          <SectionHeading eyebrow="Auto Spares" title="Featured Products" />
          <NuxtLink to="/products" class="text-link-cta">View All Parts <span aria-hidden="true">&rsaquo;</span></NuxtLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
        </div>
      </div>
    </section>

    <section class="py-16 sm:py-20 bg-surface-soft">
      <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div class="flex flex-wrap items-end justify-between gap-4 mb-10">
          <SectionHeading eyebrow="Workshop" title="Services We Offer" />
          <NuxtLink to="/services" class="text-link-cta">View All Services <span aria-hidden="true">&rsaquo;</span></NuxtLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard v-for="service in featuredServices" :key="service.id" :service="service" />
        </div>
      </div>
    </section>

    <CtaBand
      title="Need a part or a repair? Reach us directly."
      :subtitle="`Call or WhatsApp ${contact.phonePrimary} and our team will help you find the right fit.`"
    />
  </div>
</template>
