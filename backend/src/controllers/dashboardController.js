//recebe a requisição, chama o service, formata resposta

const robotService = require('../services/robotService')

// Mapeia as colunas da view para as chaves que o frontend espera (robot, não robotid)
function mapBatteryRow(r) {
  return { robot: r.robotid, store: r.store, battery: r.battery, is_charging: r.is_charging }
}
function mapSimpleRow(r) {
  return { robot: r.robotid, store: r.store }
}
function mapFailureRow(r) {
  return {
    robot: r.robotid,
    store: r.store,
    num_tasks_success: r.success_count,
    num_tasks_failed: r.failed_count,
  }
}

function buildTable(title, columns, rows, previewLimit = 5) {
  return {
    title,
    columns,
    rows: rows.slice(0, previewLimit),
    totalRows: rows.length,
  }
}

async function getDashboardData(req, res) {
  try {
    const filters = {
      store: req.query.store,
      robot: req.query.robot,
    }

    const [lowBattery, inactive, highFailure, offline, counts, robotList, storeList] =
      await Promise.all([
        robotService.getLowBatteryRobots(filters),
        robotService.getInactiveRobots(filters),
        robotService.getHighFailureRateRobots(filters),
        robotService.getOfflineRobots(filters),
        robotService.getTotalCounts(),
        robotService.getAllRobotIds(),
        robotService.getAllStoreNames(),
      ])

    const batteryRows = lowBattery.map(mapBatteryRow)
    const inactiveRows = inactive.map(mapSimpleRow)
    const failedRows = highFailure.map(mapFailureRow)
    const offlineRows = offline.map(mapSimpleRow)

    res.json({
      summary: {
        totalRobots: counts.totalRobots,
        totalStores: counts.totalStores,
        lowBattery: batteryRows.length,
        inactive: inactiveRows.length,
        failed: failedRows.length,
        offline: offlineRows.length,
      },
      tables: {
        battery: buildTable(
          'Robôs com bateria abaixo de 10%',
          [
            { label: 'Robô', key: 'robot' },
            { label: 'Loja', key: 'store' },
            { label: 'Bateria', key: 'battery' },
            { label: 'Carregando?', key: 'is_charging' },
          ],
          batteryRows
        ),
        inactive: buildTable(
          'Robôs que não realizam tarefas há mais de 3 dias',
          [
            { label: 'Robô', key: 'robot' },
            { label: 'Loja', key: 'store' },
          ],
          inactiveRows
        ),
        failed: buildTable(
          'Robôs com alta taxa de falha',
          [
            { label: 'Robô', key: 'robot' },
            { label: 'Loja', key: 'store' },
            { label: 'Num. tasks Completadas', key: 'num_tasks_success' },
            { label: 'Num. tasks Falhadas', key: 'num_tasks_failed' },
          ],
          failedRows
        ),
        offline: buildTable(
          'Robôs offline',
          [
            { label: 'Robô', key: 'robot' },
            { label: 'Loja', key: 'store' },
          ],
          offlineRows
        ),
      },
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