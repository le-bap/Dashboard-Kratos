const pipefyService = require('../services/pipefyService')

const WARNING_WINDOW_DAYS = 7

function classifyDueDate(dueDateString) {
  const dueDate = new Date(dueDateString)
  if (isNaN(dueDate.getTime())) return null

  const now = new Date()
  const diffDays = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)

  if (diffDays < 0) return 'vencido'
  if (diffDays <= WARNING_WINDOW_DAYS) return 'proximo'
  return null // fora da janela de interesse, não aparece na tabela
}

async function getMaintenanceAlerts(req, res) {
  try {
    const cards = await pipefyService.getMaintenanceCards()

    const rows = cards
      .map((card) => ({ ...card, status: classifyDueDate(card.dueDate) }))
      .filter((card) => card.status !== null)

    res.json({
      title: 'Manutenção preventiva vencida ou próxima do vencimento',
      columns: [
        { label: 'Nº de Produção', key: 'productionNumber' },
        { label: 'Fase', key: 'phase' },
        { label: 'Vencimento', key: 'dueDate' },
        { label: 'Situação', key: 'status' },
      ],
      rows,
      totalRows: rows.length,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao buscar dados de manutenção no Pipefy' })
  }
}

module.exports = { getMaintenanceAlerts }