const express = require('express');
const router = express.Router();
const db = require('../utils/db');

router.get('/stocks', async (req, res) => {
    let stocks = await db.conn.queryAsync("SELECT * FROM stock")
    res.json(stocks)
});

module.exports = router;
