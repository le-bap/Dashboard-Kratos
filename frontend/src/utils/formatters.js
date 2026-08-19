export function formatCellValue(row, column) {
  const value = row[column.key]

  if (value === null || value === undefined) {
    return "—"
  }

  if (typeof value === "boolean") {
    return value ? "Sim" : "Não"
  }

  if (column.key === "battery") {
    return `${value}%`
  }

  return value
}

export function formatDateTime(isoString) {
  if (!isoString) return "—"

  const date = new Date(isoString)
  if (isNaN(date.getTime())) return "—"

  return date.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}