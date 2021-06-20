const db = require('../utils/db');

async function getStockList(req, res) {
    try {
        let stocks = await db.conn.queryAsync('SELECT * FROM stock');
        let subTitle = { hint: '熱門標的' };
        let listContent = { stocks, subTitle };
        console.log(stocks);
        res.render('stock/list', listContent);
        res.end();
    } catch (err) {
        next(err);
        return;
    }
}

async function getStockPrice(req, res, next) {
    try {
        const stockId = req.params.stockId;

        // 檢查是不是有該股票代碼，防止直接於網址輸入找不到的代碼
        const stock = await db.conn.queryAsync(
            'SELECT * FROM stock WHERE stock_id = ?',
            stockId
        );
        // 找不到股票，導到 404 頁面
        // 因為是 async 所以不能直接丟 ERROR
        // next("500")，就會跳到有參數的錯誤處理函示 app.use(function(err, req, res, next)
        if (stock.length === 0) return next();

        const stockName = stock[0].stock_name;
        const stockPriceCount = await db.conn.queryAsync(
            'SELECT COUNT(*) as records FROM stock_price WHERE stock_id = ?',
            stockId
        );
        const records = stockPriceCount[0].records; // stock_price 的筆數
        const perPage = 10;
        const lastPage = Math.ceil(records / perPage);
        const currentPage = req.query.page || 1;
        const offset = (currentPage - 1) * perPage;
        const stockPrices = await db.conn.queryAsync(
            'SELECT * FROM stock_price WHERE stock_id = ? ORDER BY date LIMIT ?, ?;',
            [stockId, offset, perPage]
        );

        const stocks = {
            stockId: stockId,
            stockName: stockName,
            stockPrices,
        };
        const pagination = {
            currentPage: currentPage,
            lastPage: lastPage,
        };

        res.render('stock/detail', { stocks, pagination });
        res.end();
    } catch (err) {
        return next(err);
    }
}

exports.getStockList = getStockList;

exports.getStockPrice = getStockPrice;
