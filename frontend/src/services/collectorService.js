import httpClient from "../api/httpClient"

export async function getCollectorStatus() {
  const { data } = await httpClient.get("/collector-status")
  return data.jobs
}