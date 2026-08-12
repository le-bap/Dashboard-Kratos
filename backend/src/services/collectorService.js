const supabase = require('../config/supabaseClient')

async function getAllJobStatuses() {
  const { data, error } = await supabase
    .from('collectorstatus')
    .select('*')
    .order('job_name', { ascending: true })

  if (error) throw error
  return data
}

module.exports = { getAllJobStatuses }