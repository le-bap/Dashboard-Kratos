const keenonService = require('../api/keenonService')
const upsertService = require('../db/upsertService')

const JOB_NAME = 'robot_status'

async function runRobotStatusJob() {
  await upsertService.recordJobStart(JOB_NAME)

  try {
    const stores = await keenonService.getStores()
    console.log('STORES:', JSON.stringify(stores, null, 2))
    await upsertService.upsertStores(stores)

    for (const store of stores) {
        const scenes = await keenonService.getScenesByStore(store.storeId)
        console.log(`SCENES da loja ${store.storeId}:`, JSON.stringify(scenes, null, 2))
        await upsertService.upsertScenes(scenes, store.storeId)

        const robots = await keenonService.getRobotsByStore(store.storeId)
        console.log(`ROBOTS da loja ${store.storeId}:`, JSON.stringify(robots, null, 2))

        for (const robot of robots) {
            await upsertService.upsertRobotFromList(robot) // garante que o robô existe, sempre

            try {
                const status = await keenonService.getRobotStatus(robot.robotId)
                if (status) {
                await upsertService.upsertRobotStatusDetails(status)
                }
            } catch (err) {
                console.warn(`Não foi possível enriquecer status do robô ${robot.robotId}: ${err.message}`)
            }
        }
    }

    await upsertService.recordJobSuccess(JOB_NAME)
    console.log(`[${JOB_NAME}] concluído com sucesso`)
  } catch (error) {
    console.error(`[${JOB_NAME}] falhou:`, error.message)
    await upsertService.recordJobError(JOB_NAME, error.message)
  }
}

module.exports = { runRobotStatusJob }