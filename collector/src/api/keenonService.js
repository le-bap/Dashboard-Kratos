const keenonClient = require('./keenonClient')

const SUCCESS_CODE = 610000

// Toda resposta da Keenon vem com um "code" próprio, independente do status HTTP.
// Tratamos qualquer code diferente de 610000 como falha lógica.
function unwrap(response) {
  const { code, msg, data } = response.data
  if (code !== SUCCESS_CODE) {
    throw new Error(`Keenon API retornou erro: ${code} - ${msg}`)
  }
  return data
}

async function getStores() {
  const response = await keenonClient.get('/api/open/data/v1/store/list')
  return unwrap(response) // array direto
}

async function getRobotsByStore(storeId) {
  const response = await keenonClient.get('/api/open/data/v1/store/robot/list', {
    params: { storeId },
  })
  const data = unwrap(response)
  return data ?? [] // era: return data
}

async function getScenesByStore(storeId) {
  const response = await keenonClient.get('/api/open/scene/v1/info/list', {
    params: { storeId },
  })
  const data = unwrap(response)
  return data ?? [] 
}

async function getRobotStatus(robotId) {
  const response = await keenonClient.get('/api/open/scene/v1/robot/status', {
    params: { robotId },
  })
  return unwrap(response) ?? null
}

async function getDeliveryTasksPage(storeId, startTime, endTime, page, size = 100) {
  const response = await keenonClient.get('/api/open/data/v1/store/task/food/list', {
    params: { storeId, startTime, endTime, page, size },
  })
  return unwrap(response) // { total, list }
}

async function getAllDeliveryTasks(storeId, startTime, endTime) {
  const size = 100
  let page = 1
  let allTasks = []

  while (true) {
    const { total, list } = await getDeliveryTasksPage(storeId, startTime, endTime, page, size)
    allTasks = allTasks.concat(list)

    if (allTasks.length >= total || list.length === 0) break
    page += 1
  }

  return allTasks
}

module.exports = {
  getStores,
  getRobotsByStore,
  getScenesByStore,
  getRobotStatus,
  getAllDeliveryTasks,
}