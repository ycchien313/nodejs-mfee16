const express = require('express');
const router = express.Router();
// const db = require('../utils/db');
const stockController = require("../controllers/stock")

router.get('/', stockController.getStockList);

router.get('/:stockId', stockController.getStockPrice);

module.exports = router;
