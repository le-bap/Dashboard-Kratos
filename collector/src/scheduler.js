const cron = require('node-cron')
const { runRobotStatusJob } = require('./jobs/robotStatusJob')
const { runDeliveryTasksJob } = require('./jobs/deliveryTasksJob')

async function runInitialJobs() {
  await runRobotStatusJob()      // espera terminar...
  await runDeliveryTasksJob()    // ...só então começa este
}

runInitialJobs()

cron.schedule('*/30 * * * *', runRobotStatusJob)
cron.schedule('0 */3 * * *', runDeliveryTasksJob)

console.log('Scheduler iniciado: robot_status a cada 30min, delivery_tasks a cada 3h')