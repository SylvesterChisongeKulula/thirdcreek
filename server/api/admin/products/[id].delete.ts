import { eq } from 'drizzle-orm'

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

  await db.delete(tables.products).where(eq(tables.products.id, id))
  await deleteUploadedImage(existing.image)

  return { id }
})
