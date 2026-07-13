export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/admin/login') return

  try {
    const { authenticated } = await $fetch<{ authenticated: boolean }>(
      '/api/admin/me',
    )
    if (!authenticated) return navigateTo('/admin/login')
  }
  catch {
    return navigateTo('/admin/login')
  }
})
