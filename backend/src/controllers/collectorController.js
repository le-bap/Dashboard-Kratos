const collectorService = require('../services/collectorService')
const axios = require('axios')

async function triggerCollectorRefresh(req, res) {
  try {
    const response = await axios.post(
      `${process.env.COLLECTOR_URL}/trigger`,
      {},
      {
        headers: { 'x-internal-key': process.env.COLLECTOR_INTERNAL_KEY },
        timeout: 10000, // volta ao normal — o Collector responde na hora agora
      }
    )
    res.status(response.status).json(response.data)
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data)
    }
    console.error('Erro ao contatar o Collector:', error.message)
    res.status(502).json({ error: 'Não foi possível contatar o serviço de coleta' })
  }
}

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

module.exports = { getCollectorStatus, triggerCollectorRefresh }
