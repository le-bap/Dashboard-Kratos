const express = require('express')
const router = express.Router()
const collectorController = require('../controllers/collectorController')

router.get('/collector-status', collectorController.getCollectorStatus)
router.post('/collector-status/refresh', collectorController.triggerCollectorRefresh)

module.exports = router