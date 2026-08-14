const supabase = require('./supabaseClient')
const { keenonTimeToUtcIso } = require('../utils/dateUtils')

async function upsertStores(stores) {
  const rows = stores.map((s) => ({
    storeid: s.storeId,
    storename: s.storeName,
  }))

  const { error } = await supabase.from('store').upsert(rows, { onConflict: 'storeid' })
  if (error) throw error
}

async function upsertScenes(scenes, storeId) {
  const rows = scenes.map((s) => ({
    scenecode: s.sceneCode,
    scenename: s.sceneName,
    storeid: storeId,
  }))

  const { error } = await supabase.from('scene').upsert(rows, { onConflict: 'scenecode' })
  if (error) throw error
}

async function upsertRobotStatus(robotStatus) {
  const row = {
    robotid: robotStatus.robotId,
    battery: robotStatus.power,
    chargestatus: robotStatus.chargeStatus,
    onlinestatus: robotStatus.onlineStatus,
    scenecode: robotStatus.sceneCode,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from('robot').upsert(row, { onConflict: 'robotid' })
  if (error) throw error
}

async function upsertDeliveryTasks(tasks) {
  if (tasks.length === 0) return

  const robotIds = [...new Set(tasks.map((t) => t.robotId))]

  const { data: knownRobots, error: robotsError } = await supabase
    .from('robot')
    .select('robotid')
    .in('robotid', robotIds)

  if (robotsError) throw robotsError

  const knownRobotIds = new Set(knownRobots.map((r) => r.robotid))
  const validTasks = tasks.filter((t) => knownRobotIds.has(t.robotId))
  const skippedCount = tasks.length - validTasks.length

  if (skippedCount > 0) {
    console.warn(`[delivery_tasks] Ignorando ${skippedCount} tarefa(s) de robô(s) sem loja vinculada.`)
  }

  if (validTasks.length === 0) return

  const rows = validTasks.map((t) => ({
    robotid: t.robotId,
    starttime: keenonTimeToUtcIso(t.startTime),
    endtime: keenonTimeToUtcIso(t.endTime),
    backtime: keenonTimeToUtcIso(t.backTime),
    storeid: t.storeId,
    taskmode: t.taskMode,
    taskmileage: t.taskMileage,
    taskstatus: t.taskStatus,
  }))

  const { error } = await supabase
    .from('deliverytask')
    .upsert(rows, { onConflict: 'robotid,starttime' })

  if (error) throw error
}

async function recordJobStart(jobName) {
  const { error } = await supabase
    .from('collectorstatus')
    .upsert(
      { job_name: jobName, status: 'RUNNING', lastattempt: new Date().toISOString() },
      { onConflict: 'job_name' }
    )
  if (error) throw error
}

async function recordJobSuccess(jobName) {
  const now = new Date().toISOString()
  const { error } = await supabase
    .from('collectorstatus')
    .upsert(
      { job_name: jobName, status: 'SUCCESS', lastattempt: now, last_success: now, error_message: null },
      { onConflict: 'job_name' }
    )
  if (error) throw error
}

async function recordJobError(jobName, errorMessage) {
  const { error } = await supabase
    .from('collectorstatus')
    .upsert(
      { job_name: jobName, status: 'ERROR', lastattempt: new Date().toISOString(), error_message: errorMessage },
      { onConflict: 'job_name' }
    )
  if (error) throw error
}

async function getLastSuccessTime(jobName) {
  const { data, error } = await supabase
    .from('collectorstatus')
    .select('last_success')
    .eq('job_name', jobName)
    .maybeSingle()

  if (error) throw error
  return data?.last_success ?? null
}

async function upsertRobotFromList(robot) {
  const row = {
    robotid: robot.robotId,
    battery: robot.power,
    onlinestatus: Boolean(robot.onlineStatus),
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from('robot').upsert(row, { onConflict: 'robotid' })
  if (error) throw error
}

async function upsertRobotStatusDetails(status) {
  const row = {
    robotid: status.robotId,
    chargestatus: status.chargeStatus,
    scenecode: status.sceneCode,
  }

  const { error } = await supabase.from('robot').upsert(row, { onConflict: 'robotid' })
  if (error) throw error
}

module.exports = {
  upsertStores,
  upsertScenes,
  upsertRobotFromList,
  upsertRobotStatusDetails,
  upsertDeliveryTasks,
  recordJobStart,
  recordJobSuccess,
  recordJobError,
  getLastSuccessTime,
}
