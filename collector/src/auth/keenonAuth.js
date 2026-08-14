const axios = require('axios')
require('dotenv').config()

let tokenCache = {
  accessToken: null,
  expiresAt: null, // timestamp em ms
}

const SAFETY_MARGIN_MS = 60 * 1000 // renova 60s antes do prazo, por segurança

async function fetchNewToken() {
  const params = new URLSearchParams()
  params.append('client_id', process.env.KEENON_CLIENT_ID)
  params.append('client_secret', process.env.KEENON_CLIENT_SECRET)
  params.append('grant_type', 'client_credentials')

  const response = await axios.post(
    `${process.env.KEENON_BASE_URL}/api/open/oauth/token`,
    params,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  )

  const { access_token, expires_in } = response.data

  tokenCache = {
    accessToken: access_token,
    expiresAt: Date.now() + expires_in * 1000,
  }

  return tokenCache.accessToken
}

function isTokenValid() {
  if (!tokenCache.accessToken || !tokenCache.expiresAt) return false
  return Date.now() < tokenCache.expiresAt - SAFETY_MARGIN_MS
}

async function getValidToken() {
  if (isTokenValid()) {
    return tokenCache.accessToken
  }
  return fetchNewToken()
}

function invalidateToken() {
  tokenCache = { accessToken: null, expiresAt: null }
}

module.exports = { getValidToken, invalidateToken }