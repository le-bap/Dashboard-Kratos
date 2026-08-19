import httpClient from "../api/httpClient"

export async function getCollectorStatus() {
  const { data } = await httpClient.get("/collector-status")
  return data.jobs
}

export async function triggerCollectorRefresh() {
  const { data } = await httpClient.post("/collector-status/refresh")
  return data
}