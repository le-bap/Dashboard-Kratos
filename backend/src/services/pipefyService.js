const axios = require('axios')
require('dotenv').config()

const PIPEFY_API_URL = 'https://api.pipefy.com/graphql'

const MAINTENANCE_PHASES = [
  'PV POC Teste',
  'PV FEIRA / EVENTO',
  'PV LOCADO',
  'PV VENDIDO',
  'OFICINA KTS ROB',
  'CHECK TEC RETORNO ROBÔ - TECNICA',
  'CHECK TEC PDI - Eq.Técnica',
  'REC & SETUP - TEC',
]

async function pipefyQuery(query) {
  const response = await axios.post(
    PIPEFY_API_URL,
    { query },
    {
      headers: {
        Authorization: `Bearer ${process.env.PIPEFY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (response.data.errors) {
    throw new Error(`Pipefy retornou erro: ${JSON.stringify(response.data.errors)}`)
  }

  return response.data.data
}

async function getAllCards(pipeId) {
  let allCards = []
  let cursor = null
  let hasNextPage = true

  while (hasNextPage) {
    const afterParam = cursor ? `, after: "${cursor}"` : ''
    const query = `
        {
            allCards(pipeId: "${pipeId}", first: 50${afterParam}) {
            pageInfo { endCursor hasNextPage }
            edges {
                node {
                id
                title
                due_date
                current_phase { name }
                fields { name value }
                }
            }
            }
        }
        `

    const data = await pipefyQuery(query)
    const { edges, pageInfo } = data.allCards

    allCards = allCards.concat(edges.map((e) => e.node))
    hasNextPage = pageInfo.hasNextPage
    cursor = pageInfo.endCursor
  }

  return allCards
}

function getFieldValue(card, fieldName) {
  const field = card.fields.find((f) => f.name === fieldName)
  return field ? field.value : null
}

function normalizeWhitespace(str) {
  return str.trim().replace(/\s+/g, ' ')
}

const NORMALIZED_MAINTENANCE_PHASES = new Set(
  MAINTENANCE_PHASES.map(normalizeWhitespace)
)

async function getMaintenanceCards() {
  const pipeId = process.env.PIPEFY_MAINTENANCE_PIPE_ID
  const cards = await getAllCards(pipeId)

  const matchingCards = cards.filter((card) =>
    NORMALIZED_MAINTENANCE_PHASES.has(normalizeWhitespace(card.current_phase.name))
  )

  return matchingCards
  .map((card) => ({
    productionNumber: getFieldValue(card, 'Nro de PRODUÇÃO'),
    phase: card.current_phase.name,
    dueDate: card.due_date,
  }))
  .filter((item) => item.dueDate)
}

module.exports = { getMaintenanceCards }