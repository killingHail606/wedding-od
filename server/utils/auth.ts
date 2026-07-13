import type { H3Event } from 'h3'
import { createHmac, timingSafeEqual } from 'node:crypto'

const COOKIE = 'admin_session'

function sign(secret: string): string {
  return createHmac('sha256', secret).update('admin-session-v1').digest('hex')
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

/** Verifies the submitted password against the configured admin password. */
export function checkPassword(password: string): boolean {
  const config = useRuntimeConfig()
  if (!config.adminPassword) return false
  return safeEqual(password, config.adminPassword)
}

/** Issues the signed admin session cookie. */
export function startAdminSession(event: H3Event): void {
  const config = useRuntimeConfig()
  setCookie(event, COOKIE, sign(config.sessionSecret), {
    httpOnly: true,
    sameSite: 'lax',
    secure: !import.meta.dev,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export function endAdminSession(event: H3Event): void {
  deleteCookie(event, COOKIE, { path: '/' })
}

export function isAuthenticated(event: H3Event): boolean {
  const config = useRuntimeConfig()
  const token = getCookie(event, COOKIE)
  if (!token || !config.sessionSecret) return false
  return safeEqual(token, sign(config.sessionSecret))
}

/** Guard for admin API routes — throws 401 when not authenticated. */
export function requireAdmin(event: H3Event): void {
  if (!isAuthenticated(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
}
