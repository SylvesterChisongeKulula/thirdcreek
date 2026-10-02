import { eq } from 'drizzle-orm'
import { mkdir, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Db } from '../db/client'

export const UPLOADS_DIR = join(process.cwd(), '.data', 'uploads', 'products')
const UPLOADS_URL_PREFIX = '/api/uploads/products/'

export async function getAllProducts(db: Db) {
  return db.select().from(tables.products).all()
}

export async function generateProductId(db: Db, name: string) {
  const safeBase = slugify(name) || 'product'
  let id = safeBase
  let suffix = 2
  while (await db.select().from(tables.products).where(eq(tables.products.id, id)).get()) {
    id = `${safeBase}-${suffix}`
    suffix += 1
  }
  return id
}

const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export async function saveUploadedImage(name: string, file: { filename?: string; data: Buffer }) {
  const ext = file.filename?.includes('.') ? file.filename.slice(file.filename.lastIndexOf('.')).toLowerCase() : ''
  if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
    throw createError({ statusCode: 400, statusMessage: 'Images must be JPG, PNG or WebP' })
  }
  if (file.data.length > MAX_IMAGE_BYTES) {
    throw createError({ statusCode: 400, statusMessage: 'Images must be 5 MB or smaller' })
  }
  await mkdir(UPLOADS_DIR, { recursive: true })
  const filename = `${slugify(name) || 'product'}-${Date.now()}${ext}`
  await writeFile(join(UPLOADS_DIR, filename), file.data)
  return `${UPLOADS_URL_PREFIX}${filename}`
}

export async function deleteUploadedImage(imagePath: string) {
  if (!imagePath.startsWith(UPLOADS_URL_PREFIX)) return
  const filename = imagePath.slice(UPLOADS_URL_PREFIX.length)
  try {
    await unlink(join(UPLOADS_DIR, filename))
  } catch {
    // best-effort cleanup — a missing file is not an error
  }
}
