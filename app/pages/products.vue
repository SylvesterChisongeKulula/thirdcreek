<script setup lang="ts">
import { products, brands, categories, type Brand, type Category } from '~/data/products'

useHead({
  title: 'Auto Spares — Third Creek Auto Spares',
  meta: [
    {
      name: 'description',
      content:
        'Browse genuine auto spares from Third Creek Auto Spares, covering brakes, suspension, steering, engine parts and oils for Land Rover, Range Rover, Toyota, Mercedes-Benz and BMW.',
    },
  ],
})

const activeBrand = ref<Brand | 'All'>('All')
const activeCategory = ref<Category | 'All'>('All')

const filteredProducts = computed(() =>
  products.filter((product) => {
    const brandMatch = activeBrand.value === 'All' || product.brand === activeBrand.value
    const categoryMatch = activeCategory.value === 'All' || product.category === activeCategory.value
    return brandMatch && categoryMatch
  }),
)
</script>

<template>
  <div>
    <HeroBand
      size="sm"
      eyebrow="Auto Spares"
      title="Genuine parts for the vehicles you rely on."
      subtitle="This is a sample of our catalogue. Can't see what you need? Send us an enquiry — most parts can be specially ordered."
      image="/images/stock/products-hero.jpg"
      image-alt="Close-up of a car engine bay"
    />

    <section class="py-12 sm:py-16 bg-canvas">
      <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div class="space-y-4 mb-10">
          <div>
            <p class="label-uppercase text-muted mb-3">Brand</p>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="filter-chip"
                :class="{ 'filter-chip-active': activeBrand === 'All' }"
                @click="activeBrand = 'All'"
              >
                All Brands
              </button>
              <button
                v-for="brand in brands"
                :key="brand"
                type="button"
                class="filter-chip"
                :class="{ 'filter-chip-active': activeBrand === brand }"
                @click="activeBrand = brand"
              >
                {{ brand }}
              </button>
            </div>
          </div>

          <div>
            <p class="label-uppercase text-muted mb-3">Category</p>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="filter-chip"
                :class="{ 'filter-chip-active': activeCategory === 'All' }"
                @click="activeCategory = 'All'"
              >
                All Categories
              </button>
              <button
                v-for="category in categories"
                :key="category"
                type="button"
                class="filter-chip"
                :class="{ 'filter-chip-active': activeCategory === category }"
                @click="activeCategory = category"
              >
                {{ category }}
              </button>
            </div>
          </div>
        </div>

        <p class="text-[14px] text-muted mb-6">{{ filteredProducts.length }} products</p>

        <div v-if="filteredProducts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
        </div>
        <div v-else class="py-16 text-center border border-dashed border-hairline-strong">
          <p class="font-body text-body">No products match these filters yet &mdash; try a different combination, or send us an enquiry.</p>
        </div>
      </div>
    </section>

    <CtaBand
      title="Looking for something specific?"
      subtitle="Special orders are typically ready within 3 months; emergency orders within 7 business days."
    />
  </div>
</template>
