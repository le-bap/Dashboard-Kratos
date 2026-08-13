const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboardController')
const tableController = require('../controllers/tableController')

router.get('/dashboard', dashboardController.getDashboardData)
router.get('/dashboard/:type', tableController.getTable)

module.exports = router