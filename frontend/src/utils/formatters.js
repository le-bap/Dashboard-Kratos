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