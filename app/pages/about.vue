<script setup lang="ts">
import {
  coreValues,
  whyChooseUs,
  supplierCountries,
  team,
  missionStatement,
  visionStatement,
  aboutHeroImage,
  staffPortraitImage,
  teamGalleryImages,
} from '~/data/company'

useHead({
  title: 'About Us — Third Creek Auto Spares',
  meta: [
    {
      name: 'description',
      content:
        'Meet Third Creek Auto Spares, a Zambian-owned auto parts business founded on two decades of hands-on motor industry expertise.',
    },
  ],
})
</script>

<template>
  <div>
    <HeroBand
      size="sm"
      eyebrow="About Us"
      title="Built on two decades of hands-on motor industry expertise."
      :image="aboutHeroImage"
      image-alt="The Third Creek Auto Spares team"
    />

    <section class="py-16 sm:py-20 bg-canvas">
      <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <SectionHeading eyebrow="Our Story" title="Founded by a specialist in the field." />
        <div class="space-y-4 font-body font-light text-body leading-relaxed text-[15px]">
          <p>
            Third Creek Investments Limited is a Zambian-owned company, operational since 8th May 2020. We sell
            brand new and genuine automotive parts to ensure the safety and longevity of your vehicle.
          </p>
          <p>
            Our founder, Nede Nalwamba Kabungo, brings over 20 years of experience across the motor industry &mdash;
            from Toyota Zambia, to Jaguar Land Rover Zambia, to John Deere Zambia, and finally Jaguar Land Rover
            in the United States &mdash; before returning home to build her own auto spares business.
          </p>
          <p>
            We deal in parts for hybrid and conventional vehicles including Land Rover, Range Rover, Mercedes-Benz
            and BMW, with a growing range for Toyota. We currently operate from Kabwata and Chalala, with a third
            base in Ibex Hill, Meanwood, and we're set up to expand to other towns in Zambia.
          </p>
        </div>
      </div>
    </section>

    <section class="py-16 sm:py-20 bg-surface-dark text-on-dark">
      <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-2 gap-10">
        <div>
          <p class="label-uppercase text-accent mb-3">Our Mission</p>
          <p class="font-body font-light text-on-dark-soft leading-relaxed">{{ missionStatement }}</p>
        </div>
        <div>
          <p class="label-uppercase text-accent mb-3">Our Vision</p>
          <p class="font-body font-light text-on-dark-soft leading-relaxed">{{ visionStatement }}</p>
        </div>
      </div>
    </section>

    <section class="py-16 sm:py-20 bg-canvas">
      <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading eyebrow="What Drives Us" title="Our Core Values" align="center" />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <div v-for="value in coreValues" :key="value.title">
            <h3 class="font-display font-bold text-lg text-ink mb-2">{{ value.title }}</h3>
            <p class="font-body font-light text-[14px] text-body leading-relaxed">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 sm:py-20 bg-surface-soft">
      <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="aspect-[4/5] bg-surface-card overflow-hidden order-2 lg:order-1">
          <img :src="staffPortraitImage" alt="A Third Creek Auto Spares team member" class="h-full w-full object-cover" loading="lazy" />
        </div>
        <div class="order-1 lg:order-2">
          <SectionHeading eyebrow="Why Choose Us" title="What our customers can count on" />
          <div class="mt-8">
            <TrustBadgeRow />
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 sm:py-20 bg-canvas">
      <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading eyebrow="Leadership" title="Our Executive Board" align="center" />
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 max-w-3xl mx-auto">
          <div v-for="member in team" :key="member.name" class="text-center">
            <div class="mx-auto h-28 w-28 rounded-full overflow-hidden bg-surface-card mb-4">
              <img :src="member.image" :alt="member.name" class="h-full w-full object-cover" loading="lazy" />
            </div>
            <h3 class="font-display font-bold text-base text-ink">{{ member.name }}</h3>
            <p class="text-[13px] text-muted mt-1">{{ member.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 sm:py-20 bg-surface-soft">
      <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading eyebrow="The People Behind The Counter" title="Our Full Team" align="center" />
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          <div v-for="(photo, i) in teamGalleryImages" :key="photo" class="aspect-square bg-surface-card overflow-hidden">
            <img :src="photo" :alt="`Third Creek Auto Spares team photo ${i + 1}`" class="h-full w-full object-cover" loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 sm:py-20 bg-surface-soft">
      <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 text-center">
        <SectionHeading eyebrow="Global Sourcing" title="We source from countries that lead the auto world" align="center" />
        <div class="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          <div v-for="country in supplierCountries" :key="country.name" class="flex items-center gap-2">
            <span class="text-2xl" aria-hidden="true">{{ country.flag }}</span>
            <span class="font-display font-bold text-lg text-ink">{{ country.name }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
