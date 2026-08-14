// Converte o horário "cru" da Keenon (horário local do robô, sem fuso explícito)
// para um timestamp UTC correto, sabendo o offset daquele robô.
//
// Hoje fixo em -3 (Brasil) porque nós configuramos o relógio dos robôs
// manualmente. Se um dia a Kratos tiver robôs em outros fusos, esse offset
// precisa vir de uma configuração por robô/loja, não mais como constante aqui.
const DEFAULT_OFFSET = '-03:00'

function keenonTimeToUtcIso(rawDateString) {
  if (!rawDateString) return null

  // "2026-08-14 06:23:00" -> "2026-08-14T06:23:00-03:00"
  const isoLocal = rawDateString.replace(' ', 'T') + DEFAULT_OFFSET
  const date = new Date(isoLocal)

  if (isNaN(date.getTime())) {
    throw new Error(`Data inválida recebida da Keenon: "${rawDateString}"`)
  }

  return date.toISOString() // sempre em UTC, formato que o Postgres espera
}

module.exports = { keenonTimeToUtcIso }