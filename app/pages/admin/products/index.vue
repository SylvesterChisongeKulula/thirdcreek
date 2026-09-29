<script setup lang="ts">
import { Plus } from '@lucide/vue'
import type { Product } from '~/data/products'

definePageMeta({ layout: 'admin', title: 'Products' })

const { productsState, deleteProduct } = useAdminProducts()
const { user } = useAuth()

const isOwner = computed(() => user.value?.authRole === 'owner')

const showForm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const editingProduct = ref<Product | null>(null)

function openAdd() {
  formMode.value = 'create'
  editingProduct.value = null
  showForm.value = true
}

function openEdit(product: Product) {
  formMode.value = 'edit'
  editingProduct.value = product
  showForm.value = true
}

async function onDelete(product: Product) {
  if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return
  await deleteProduct(product.id)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <p class="label-uppercase text-muted">{{ productsState.length }} products</p>
      <button v-if="isOwner" type="button" class="btn-primary inline-flex items-center gap-2" @click="openAdd">
        <Plus :size="16" />
        Add Product
      </button>
    </div>

    <div class="crm-panel overflow-x-auto">
      <table class="w-full min-w-[720px] text-left text-[14px]">
        <thead>
          <tr class="border-b border-hairline text-[12px] text-muted">
            <th class="pb-3 font-normal">Image</th>
            <th class="pb-3 font-normal">Name</th>
            <th class="pb-3 font-normal">Brand</th>
            <th class="pb-3 font-normal">Category</th>
            <th class="pb-3 font-normal">Blurb</th>
            <th v-if="isOwner" class="pb-3 font-normal">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in productsState" :key="product.id" class="border-b border-hairline last:border-b-0">
            <td class="py-3">
              <img :src="product.image" :alt="product.name" class="h-12 w-12 border border-hairline object-cover" />
            </td>
            <td class="py-3 font-semibold text-ink">{{ product.name }}</td>
            <td class="py-3 text-body">{{ product.brand }}</td>
            <td class="py-3 text-body">{{ product.category }}</td>
            <td class="py-3 text-muted">{{ product.blurb }}</td>
            <td v-if="isOwner" class="py-3">
              <div class="flex gap-3">
                <button type="button" class="text-link-cta" @click="openEdit(product)">Edit</button>
                <button type="button" class="text-[13px] font-bold uppercase tracking-[1.5px] text-error" @click="onDelete(product)">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="productsState.length === 0" class="py-8 text-center text-[14px] text-muted">No products yet.</p>
    </div>

    <ProductFormModal v-model="showForm" :mode="formMode" :product="editingProduct" />
  </div>
</template>
