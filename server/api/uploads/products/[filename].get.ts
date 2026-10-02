import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
}

export default defineEventHandler(async (event) => {
  const filename = getRouterParam(event, 'filename')
  if (!filename || filename.includes('/') || filename.includes('..')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid filename' })
  }

  const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase()
  const contentType = MIME_TYPES[ext]
  if (!contentType) throw createError({ statusCode: 400, statusMessage: 'Unsupported file type' })

  try {
    const data = await readFile(join(UPLOADS_DIR, filename))
    setResponseHeader(event, 'Content-Type', contentType)
    setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
    return data
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Image not found' })
  }
})
