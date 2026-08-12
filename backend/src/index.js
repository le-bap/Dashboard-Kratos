const express = require('express')
const cors = require('cors')
require('dotenv').config()

const dashboardRoutes = require('./routes/dashboardRoutes')
const collectorRoutes = require('./routes/collectorRoutes')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', dashboardRoutes)
app.use('/api', collectorRoutes)

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})