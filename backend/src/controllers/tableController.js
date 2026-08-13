const TABLE_DEFINITIONS = require('../config/tableDefinitions')

async function getTable(req, res) {
  try {
    const { type } = req.params
    const definition = TABLE_DEFINITIONS[type]

    if (!definition) {
      return res.status(404).json({ error: `Tabela "${type}" não encontrada` })
    }

    const filters = { store: req.query.store, robot: req.query.robot }
    const rawRows = await definition.fetch(filters)
    const rows = rawRows.map(definition.mapRow)

    res.json({
      title: definition.title,
      columns: definition.columns,
      rows,
      totalRows: rows.length,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao buscar a tabela' })
  }
}

module.exports = { getTable }