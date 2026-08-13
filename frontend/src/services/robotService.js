import httpClient from "../api/httpClient"

export async function getDashboardData(filters = {}) {
  const { data } = await httpClient.get("/dashboard", {
    params: {
      store: filters.store || undefined,
      robot: filters.robot || undefined,
    },
  })
  return data
}

export async function getFullTable(type, filters = {}) {
  const { data } = await httpClient.get(`/dashboard/${type}`, {
    params: {
      store: filters.store || undefined,
      robot: filters.robot || undefined,
    },
  })
  return data
}