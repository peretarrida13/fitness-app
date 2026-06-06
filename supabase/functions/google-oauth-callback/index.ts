// Google OAuth callback for Android Capacitor app.
// Receives the authorization code from Google, exchanges it for an access_token
// server-side using PKCE (code_verifier is embedded in the state param),
// then 302-redirects into the app via the custom deep-link scheme.
// Deploy: supabase functions deploy google-oauth-callback --no-verify-jwt
Deno.serve(async (req) => {
  const url = new URL(req.url)
  const error = url.searchParams.get('error')
  if (error) {
    return new Response(`Google OAuth error: ${error}`, { status: 400 })
  }

  const code = url.searchParams.get('code')
  const stateParam = url.searchParams.get('state')

  if (!code || !stateParam) {
    return new Response('Missing code or state', { status: 400 })
  }

  // Decode state to recover nonce and codeVerifier
  let nonce: string
  let codeVerifier: string
  try {
    const decoded = JSON.parse(atob(stateParam))
    nonce = decoded.nonce
    codeVerifier = decoded.codeVerifier
    if (!nonce || !codeVerifier) throw new Error('invalid')
  } catch {
    return new Response('Invalid state parameter', { status: 400 })
  }

  // Exchange code for access_token using PKCE (no client_secret for public-client flow).
  // If your Google OAuth client is a "Web application" type and this fails with
  // invalid_client, set GOOGLE_CLIENT_SECRET in Supabase secrets and redeploy.
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID') ?? ''
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET') ?? ''
  const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/google-oauth-callback`

  const body: Record<string, string> = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
    code_verifier: codeVerifier,
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body),
  })

  const tokenData = await tokenRes.json()

  if (!tokenRes.ok || !tokenData.access_token) {
    console.error('Token exchange failed:', JSON.stringify(tokenData))
    return new Response(
      `Token exchange failed: ${tokenData.error ?? 'unknown'} — ${tokenData.error_description ?? ''}`,
      { status: 400 }
    )
  }

  // 302 redirect into the app — Chrome Custom Tab interprets this as an Android intent
  const deepLink = `com.peretarrida.fittracker://oauth/google?access_token=${encodeURIComponent(tokenData.access_token)}&nonce=${encodeURIComponent(nonce)}`
  return new Response(null, {
    status: 302,
    headers: { Location: deepLink },
  })
})
