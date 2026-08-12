const express = require('express')
const router = express.Router()
const collectorController = require('../controllers/collectorController')

router.get('/collector-status', collectorController.getCollectorStatus)

module.exports = router