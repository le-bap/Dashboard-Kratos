//recebe a requisição, chama o service, formata resposta
const robotService = require('../services/robotService')
const TABLE_DEFINITIONS = require('../config/tableDefinitions')

function buildTable(definition, rawRows, previewLimit = 5) {
  const rows = rawRows.map(definition.mapRow)
  return {
    title: definition.title,
    columns: definition.columns,
    rows: rows.slice(0, previewLimit),
    totalRows: rows.length,
  }
}

async function getDashboardData(req, res) {
  try {
    const filters = { store: req.query.store, robot: req.query.robot }

    const [battery, inactive, failed, offline, counts, robotList, storeList] = await Promise.all([
      TABLE_DEFINITIONS.battery.fetch(filters),
      TABLE_DEFINITIONS.inactive.fetch(filters),
      TABLE_DEFINITIONS.failed.fetch(filters),
      TABLE_DEFINITIONS.offline.fetch(filters),
      robotService.getTotalCounts(),
      robotService.getAllRobotIds(),
      robotService.getAllStoreNames(),
    ])

    const tables = {
      battery: buildTable(TABLE_DEFINITIONS.battery, battery),
      inactive: buildTable(TABLE_DEFINITIONS.inactive, inactive),
      failed: buildTable(TABLE_DEFINITIONS.failed, failed),
      offline: buildTable(TABLE_DEFINITIONS.offline, offline),
    }

    res.json({
      summary: {
        totalRobots: counts.totalRobots,
        totalStores: counts.totalStores,
        lowBattery: tables.battery.totalRows,
        inactive: tables.inactive.totalRows,
        failed: tables.failed.totalRows,
        offline: tables.offline.totalRows,
      },
      tables,
      filterBar: {
        robotList: robotList.map((robotid) => ({ robotid })),
        storeList: storeList.map((storeName) => ({ storeName })),
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao buscar dados do dashboard' })
  }
}

module.exports = { getDashboardData }