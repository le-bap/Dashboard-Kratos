// faz as consultas ao Supabase
const supabase = require('../config/supabaseClient')

// Aplica os filtros de loja (parcial) e robô (exato) numa query já iniciada
function applyFilters(query, filters, robotColumn = 'robotid') {
  if (filters.store) {
    query = query.ilike('store', `%${filters.store}%`)
  }
  if (filters.robot) {
    query = query.eq(robotColumn, filters.robot)
  }
  return query
}

async function getLowBatteryRobots(filters = {}) {
  let query = supabase.from('v_low_battery_robots').select('*')
  query = applyFilters(query, filters)

  const { data, error } = await query
  if (error) throw error
  return data
}

async function getInactiveRobots(filters = {}) {
  let query = supabase.from('v_inactive_robots').select('*')
  query = applyFilters(query, filters)

  const { data, error } = await query
  if (error) throw error
  return data
}

async function getHighFailureRateRobots(filters = {}) {
  let query = supabase.from('v_high_failure_rate_robots').select('*')
  query = applyFilters(query, filters)

  const { data, error } = await query
  if (error) throw error
  return data
}

async function getOfflineRobots(filters = {}) {
  let query = supabase.from('v_offline_robots').select('*')
  query = applyFilters(query, filters)

  const { data, error } = await query
  if (error) throw error
  return data
}

async function getTotalCounts() {
  const [
    { count: totalRobots, error: robotsError },
    { count: totalStores, error: storesError },
  ] = await Promise.all([
    supabase.from('robot').select('*', { count: 'exact', head: true }),
    supabase.from('store').select('*', { count: 'exact', head: true }),
  ])

  if (robotsError) throw robotsError
  if (storesError) throw storesError

  return { totalRobots, totalStores }
}

async function getAllRobotIds() {
  const { data, error } = await supabase.from('robot').select('robotid')
  if (error) throw error
  return data.map((r) => r.robotid)
}

async function getAllStoreNames() {
  const { data, error } = await supabase.from('store').select('storename')
  if (error) throw error
  return data.map((s) => s.storename)
}

module.exports = {
  getLowBatteryRobots,
  getInactiveRobots,
  getHighFailureRateRobots,
  getOfflineRobots,
  getTotalCounts,
  getAllRobotIds,
  getAllStoreNames,
}