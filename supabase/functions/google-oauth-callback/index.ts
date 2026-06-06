// OAuth redirect bridge: Google sends the authorization code here,
// we immediately redirect into the Android app via custom scheme.
// Deploy with: supabase functions deploy google-oauth-callback --no-verify-jwt
Deno.serve(async (req) => {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')

  if (error) {
    return new Response(`Google OAuth error: ${error}`, { status: 400 })
  }

  if (!code) {
    return new Response('Missing code parameter', { status: 400 })
  }

  const params = new URLSearchParams({ code })
  if (state) params.set('state', state)

  const deepLink = `com.peretarrida.fittracker://oauth/google?${params.toString()}`

  return new Response(null, {
    status: 302,
    headers: { Location: deepLink },
  })
})
