export default defineEventHandler(async () => {
  return getAllProducts(useDb())
})
