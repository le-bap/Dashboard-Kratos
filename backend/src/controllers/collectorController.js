const collectorService = require('../services/collectorService')

async function getCollectorStatus(req, res) {
  try {
    const jobs = await collectorService.getAllJobStatuses()

    const formattedJobs = jobs.map((job) => ({
      jobName: job.job_name,
      status: job.status,
      isRunning: job.status === 'RUNNING',
      lastAttempt: job.lastattempt,
      lastSuccess: job.last_success,
      errorMessage: job.error_message,
    }))

    res.json({ jobs: formattedJobs })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao buscar status do collector' })
  }
}

module.exports = { getCollectorStatus }