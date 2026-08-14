const axios = require('axios')
const { getValidToken, invalidateToken } = require('../auth/keenonAuth')
require('dotenv').config()

const keenonClient = axios.create({
  baseURL: process.env.KEENON_BASE_URL,
  timeout: 15000,
})

// Antes de qualquer chamada, garante um token válido e injeta no header
keenonClient.interceptors.request.use(async (config) => {
  const token = await getValidToken()
  config.headers.Authorization = `bearer ${token}`
  return config
})

// Se a Keenon rejeitar o token (401), renova e tenta a MESMA chamada de novo,
// uma única vez -> cumpre o RNF "se token expirado, gerar novo imediatamente"
keenonClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      invalidateToken()
      const newToken = await getValidToken()
      originalRequest.headers.Authorization = `bearer ${newToken}`
      return keenonClient(originalRequest)
    }

    return Promise.reject(error)
  }
)

module.exports = keenonClient