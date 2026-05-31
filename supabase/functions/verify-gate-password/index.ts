import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Server-side rate limit: 10 attempts per IP per 15 min
const ipAttempts = new Map<string, number[]>()

function serverRateLimit(ip: string): boolean {
  const now = Date.now()
  const cutoff = now - 15 * 60 * 1000
  const attempts = (ipAttempts.get(ip) ?? []).filter((t) => t > cutoff)
  if (attempts.length >= 10) return false
  ipAttempts.set(ip, [...attempts, now])
  return true
}

const ALLOWED_ORIGIN = Deno.env.get('APP_URL') ?? ''

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  if (!serverRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: 'Too many attempts. Try again later.' }),
      { status: 429, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    )
  }

  const correctPassword = Deno.env.get('APP_PASSWORD')
  if (!correctPassword) {
    return new Response(
      JSON.stringify({ error: 'Server misconfiguration' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    )
  }

  let body: { password?: string }
  try {
    body = await req.json()
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request' }),
      { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    )
  }

  const { password } = body
  if (!password || typeof password !== 'string') {
    return new Response(
      JSON.stringify({ error: 'Missing password' }),
      { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    )
  }

  // Constant-time comparison to prevent timing attacks
  const encoder = new TextEncoder()
  const a = encoder.encode(password.trim())
  const b = encoder.encode(correctPassword)

  if (a.length !== b.length) {
    return new Response(
      JSON.stringify({ error: 'Incorrect password' }),
      { status: 401, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    )
  }

  let mismatch = 0
  for (let i = 0; i < a.length; i++) mismatch |= a[i] ^ b[i]

  if (mismatch !== 0) {
    return new Response(
      JSON.stringify({ error: 'Incorrect password' }),
      { status: 401, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    )
  }

  return new Response(
    JSON.stringify({ ok: true }),
    { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
  )
})
