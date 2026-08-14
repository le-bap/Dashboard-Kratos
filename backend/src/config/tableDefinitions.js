const robotService = require('../services/robotService')

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

const TABLE_DEFINITIONS = {
  battery: {
    title: 'Robôs com bateria abaixo de 10%',
    columns: [
      { label: 'Robô', key: 'robot' },
      { label: 'Loja', key: 'store' },
      { label: 'Bateria', key: 'battery' },
      { label: 'Carregando?', key: 'is_charging' },
    ],
    fetch: robotService.getLowBatteryRobots,
    mapRow: mapBatteryRow,
  },
  inactive: {
    title: 'Robôs (online) que não realizam tarefas há mais de 72 horas',
    columns: [
      { label: 'Robô', key: 'robot' },
      { label: 'Loja', key: 'store' },
    ],
    fetch: robotService.getInactiveRobots,
    mapRow: mapSimpleRow,
  },
  failed: {
    title: 'Robôs (online) com alta taxa de falha na entrega',
    columns: [
      { label: 'Robô', key: 'robot' },
      { label: 'Loja', key: 'store' },
      { label: 'Num. tasks Completadas', key: 'num_tasks_success' },
      { label: 'Num. tasks Falhadas', key: 'num_tasks_failed' },
    ],
    fetch: robotService.getHighFailureRateRobots,
    mapRow: mapFailureRow,
  },
  offline: {
    title: 'Robôs offline',
    columns: [
      { label: 'Robô', key: 'robot' },
      { label: 'Loja', key: 'store' },
    ],
    fetch: robotService.getOfflineRobots,
    mapRow: mapSimpleRow,
  },
}

module.exports = TABLE_DEFINITIONS