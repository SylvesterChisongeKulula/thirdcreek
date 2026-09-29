import { eq } from 'drizzle-orm'
import type { Brand, Category } from '../../../../app/data/products'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing product id' })

  const session = await getUserSession(event)
  if (session.data?.authRole !== 'owner') {
    throw createError({ statusCode: 403, statusMessage: 'Only the owner can manage products' })
  }

  const db = useDb()
  const existing = await db.select().from(tables.products).where(eq(tables.products.id, id)).get()
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Product not found' })

  const parts = await readMultipartFormData(event)
  if (!parts) throw createError({ statusCode: 400, statusMessage: 'Missing form data' })

  const fields: Record<string, string> = {}
  const imagePart = parts.find((part) => part.name === 'image' && part.filename)
  for (const part of parts) {
    if (part.name && part.name !== 'image') fields[part.name] = part.data.toString('utf-8')
  }

  const name = fields.name || existing.name
  const brand = (fields.brand as Brand) || existing.brand
  const category = (fields.category as Category) || existing.category
  const blurb = fields.blurb || existing.blurb
  const image = imagePart ? await saveUploadedImage(name, imagePart) : existing.image

  await db.update(tables.products).set({ name, brand, category, blurb, image }).where(eq(tables.products.id, id))

  if (imagePart) await deleteUploadedImage(existing.image)

  return { id, name, brand, category, blurb, image }
})
