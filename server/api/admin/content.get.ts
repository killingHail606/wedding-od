export default defineEventHandler((event) => {
  requireAdmin(event)
  return getContent()
})
