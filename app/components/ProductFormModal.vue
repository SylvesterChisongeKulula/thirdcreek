<script setup lang="ts">
import { brands, categories } from '~/data/products'
import type { Brand, Category, Product } from '~/data/products'

const props = defineProps<{
  modelValue: boolean
  mode: 'create' | 'edit'
  product?: Product | null
}>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; saved: [product: Product] }>()

const { addProduct, updateProduct } = useAdminProducts()

const form = reactive({
  name: '',
  brand: brands[0] as Brand,
  category: categories[0] as Category,
  blurb: '',
})

const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const error = ref('')
const submitting = ref(false)

function resetForm() {
  form.name = props.product?.name ?? ''
  form.brand = props.product?.brand ?? brands[0]
  form.category = props.product?.category ?? categories[0]
  form.blurb = props.product?.blurb ?? ''
  imageFile.value = null
  imagePreview.value = props.product?.image ?? null
  error.value = ''
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) resetForm()
  },
)

function onImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null
  imageFile.value = file
  imagePreview.value = file ? URL.createObjectURL(file) : (props.product?.image ?? null)
}

function close() {
  emit('update:modelValue', false)
}

async function submit() {
  if (!form.name.trim() || !form.blurb.trim() || (props.mode === 'create' && !imageFile.value)) {
    error.value = 'Name, blurb and an image are required.'
    return
  }

  submitting.value = true
  try {
    const input = {
      name: form.name.trim(),
      brand: form.brand,
      category: form.category,
      blurb: form.blurb.trim(),
      image: imageFile.value,
    }

    const product =
      props.mode === 'create' ? await addProduct(input) : await updateProduct(props.product!.id, input)

    emit('saved', product)
    close()
  } catch {
    error.value = 'Something went wrong — please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <AdminModal
    :model-value="modelValue"
    :title="mode === 'create' ? 'Add Product' : 'Edit Product'"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="flex flex-col gap-4">
      <p v-if="error" class="text-[13px] text-error">{{ error }}</p>

      <input v-model="form.name" type="text" placeholder="Product name" class="text-input" />

      <select v-model="form.brand" class="text-input">
        <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
      </select>

      <select v-model="form.category" class="text-input">
        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
      </select>

      <textarea v-model="form.blurb" placeholder="Short description" rows="3" class="text-input"></textarea>

      <div class="flex items-center gap-4">
        <img
          v-if="imagePreview"
          :src="imagePreview"
          alt="Product preview"
          class="h-16 w-16 shrink-0 border border-hairline object-cover"
        />
        <input type="file" accept="image/*" class="text-[13px]" @change="onImageChange" />
      </div>
    </div>

    <template #footer>
      <button type="button" class="btn-secondary" @click="close">Cancel</button>
      <button type="button" class="btn-primary" :disabled="submitting" @click="submit">
        {{ submitting ? 'Saving…' : 'Save Product' }}
      </button>
    </template>
  </AdminModal>
</template>
