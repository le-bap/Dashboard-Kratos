const keenonService = require('../api/keenonService')
const upsertService = require('../db/upsertService')

const JOB_NAME = 'delivery_tasks'
const FALLBACK_WINDOW_HOURS = 72 // só usado na primeiríssima execução, sem histórico ainda

async function runDeliveryTasksJob() {
  await upsertService.recordJobStart(JOB_NAME)

  try {
    const lastSuccess = await upsertService.getLastSuccessTime(JOB_NAME)
    const endTime = Date.now()
    const startTime = lastSuccess
      ? new Date(lastSuccess).getTime()
      : endTime - FALLBACK_WINDOW_HOURS * 60 * 60 * 1000

    const stores = await keenonService.getStores()

    for (const store of stores) {
      const tasks = await keenonService.getAllDeliveryTasks(store.storeId, startTime, endTime)
      await upsertService.upsertDeliveryTasks(tasks)
    }

    await upsertService.recordJobSuccess(JOB_NAME)
    console.log(`[${JOB_NAME}] concluído com sucesso`)
  } catch (error) {
    console.error(`[${JOB_NAME}] falhou:`, error.message)
    console.error('DETALHES:', error.details || error.hint || '(sem detalhe adicional)')
    await upsertService.recordJobError(JOB_NAME, error.message)
  }
}

module.exports = { runDeliveryTasksJob }