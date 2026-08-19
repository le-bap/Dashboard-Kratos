const express = require('express')
require('dotenv').config()

const { runRobotStatusJob } = require('./jobs/robotStatusJob')
const { runDeliveryTasksJob } = require('./jobs/deliveryTasksJob')
const supabase = require('./db/supabaseClient')

const app = express()
const PORT = process.env.COLLECTOR_PORT || 4000

// Protege o endpoint: só aceita chamadas que conheçam a chave interna
function checkInternalKey(req, res, next) {
  const key = req.headers['x-internal-key']
  if (key !== process.env.INTERNAL_API_KEY) {
    return res.status(401).json({ error: 'Não autorizado' })
  }
  next()
}

async function isAnyJobRunning() {
  const { data, error } = await supabase
    .from('collectorstatus')
    .select('job_name')
    .eq('status', 'RUNNING')

  if (error) throw error
  return data.length > 0
}

app.post('/trigger', checkInternalKey, async (req, res) => {
  try {
    if (await isAnyJobRunning()) {
      return res.status(409).json({ error: 'Já existe uma coleta em andamento. Tente novamente em instantes.' })
    }

    // Dispara os jobs em segundo plano, SEM esperar terminarem
    runRobotStatusJob()
      .then(() => runDeliveryTasksJob())
      .catch((err) => console.error('Erro inesperado na coleta em segundo plano:', err.message))

    res.status(202).json({ message: 'Coleta iniciada' })
  } catch (error) {
    console.error('Erro ao iniciar coleta manual:', error.message)
    res.status(500).json({ error: 'Erro ao iniciar a coleta' })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor do Collector escutando em http://localhost:${PORT}`)
})

module.exports = app