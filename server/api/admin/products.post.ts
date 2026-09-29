import type { Brand, Category, Product } from '../../../app/data/products'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (session.data?.authRole !== 'owner') {
    throw createError({ statusCode: 403, statusMessage: 'Only the owner can manage products' })
  }

  const parts = await readMultipartFormData(event)
  if (!parts) throw createError({ statusCode: 400, statusMessage: 'Missing form data' })

  const fields: Record<string, string> = {}
  const imagePart = parts.find((part) => part.name === 'image' && part.filename)
  for (const part of parts) {
    if (part.name && part.name !== 'image') fields[part.name] = part.data.toString('utf-8')
  }

  const { name, brand, category, blurb } = fields
  if (!name || !brand || !category || !blurb || !imagePart) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required product fields' })
  }

  const db = useDb()
  const id = await generateProductId(db, name)
  const image = await saveUploadedImage(name, imagePart)
  const createdAt = todayISO()

  const product: Product = { id, name, brand: brand as Brand, category: category as Category, blurb, image }
  await db.insert(tables.products).values({ ...product, createdAt })
  return product
})
