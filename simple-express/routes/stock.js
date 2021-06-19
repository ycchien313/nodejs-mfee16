const express = require('express');
const router = express.Router();
const db = require('../utils/db');

router.get('/', async (req, res) => {
    let stocks = await db.conn.queryAsync('SELECT * FROM stock');
    let subTitle = { hint: '熱門標的' };
    let listContent = { stocks, subTitle };
    console.log(stocks);
    res.render('stock/list', listContent);
    res.end();
});

router.get('/:stockId', async (req, res) => {
    const stockId = req.params.stockId;
    const stockName = await db.conn.queryAsync(
        'SELECT stock_name FROM stock WHERE stock_id = ?',
        stockId
    );
    let stockPricesCount = await db.conn.queryAsync(
        'SELECT COUNT(*) as total FROM stock_price WHERE stock_id = ?',
        stockId
    );
    stockPricesCount = stockPricesCount[0].total;
    const perPage = 10;
    const lastPage = Math.ceil(stockPricesCount / perPage);
    const currentPage = req.query.page || 1;
    const offset = (currentPage - 1) * perPage;

    let stockPrices = await db.conn.queryAsync(
        'SELECT * FROM stock_price WHERE stock_id = ? ORDER BY date LIMIT ?, ?;',
        [stockId, offset, perPage]
    );
    console.log(stockName[0].stock_name);
    const stocks = {
        stockId: stockId,
        stockName: stockName[0].stock_name,
        stockPrices,
    };
    const pagination = {
        currentPage: currentPage,
        lastPage: lastPage,
    };

    res.render('stock/detail', { stocks, pagination });
    res.end();
});

module.exports = router;
