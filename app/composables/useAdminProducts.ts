import type { Product } from '~/data/products'

export interface ProductFormInput {
  name: string
  brand: string
  category: string
  blurb: string
  image?: File | null
}

function toFormData(input: ProductFormInput) {
  const formData = new FormData()
  formData.set('name', input.name)
  formData.set('brand', input.brand)
  formData.set('category', input.category)
  formData.set('blurb', input.blurb)
  if (input.image) formData.set('image', input.image)
  return formData
}

export function useAdminProducts() {
  const productsFetch = useFetch<Product[]>('/api/admin/products', { default: () => [] })

  const productsState = computed(() => productsFetch.data.value ?? [])

  async function addProduct(input: ProductFormInput): Promise<Product> {
    const product = await $fetch<Product>('/api/admin/products', { method: 'POST', body: toFormData(input) })
    await productsFetch.refresh()
    return product
  }

  async function updateProduct(id: string, input: ProductFormInput): Promise<Product> {
    const product = await $fetch<Product>(`/api/admin/products/${id}`, { method: 'PATCH', body: toFormData(input) })
    await productsFetch.refresh()
    return product
  }

  async function deleteProduct(id: string) {
    await $fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    await productsFetch.refresh()
  }

  return { productsState, addProduct, updateProduct, deleteProduct }
}
