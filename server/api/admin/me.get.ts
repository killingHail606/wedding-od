export default defineEventHandler((event) => {
  return { authenticated: isAuthenticated(event) }
})
