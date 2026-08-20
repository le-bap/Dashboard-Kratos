import httpClient from "../api/httpClient"

export async function getMaintenanceAlerts() {
  const { data } = await httpClient.get("/maintenance")
  return data
}