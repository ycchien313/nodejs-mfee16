const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const moment = require('moment');
const mysql = require('mysql');
const axios = require('axios');
require('dotenv').config();
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    // port     : process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});
const conn = Promise.promisifyAll(connection);

/********** 取得股票成交資料，並新增至資料庫 **********/
async function insertTradingData(stockIdFile) {
    // 取得今天日期
    let currentDate = moment().format('YYYYMMDD');
    for (let i = 0; i < stockIdFile.length; i++) {
        // 取得股票成交資料
        let stockId = stockIdFile[i];
        let response = await axios
            .get(
                `https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=${currentDate}&stockNo=${stockId}`
            )
            .catch((err) => {
                throw `status: faild, 取得股票成交資訊 API 失敗, ${err}`;
            });
        let tradingDataLen = response.data.data.length;

        // 解析股票成交資料，並新增至資料庫
        for (let j = 0; j < tradingDataLen - 1; j++) {
            let date =
                parseInt(response.data.data[j][0].replace(/\//g, '')) +
                19110000;
            let transactions = response.data.data[j][1].replace(/,/g, '');
            let amount = response.data.data[j][2].replace(/,/g, '');
            let open_price = response.data.data[j][3].replace(/,/g, '');
            let high_price = response.data.data[j][4].replace(/,/g, '');
            let low_price = response.data.data[j][5].replace(/,/g, '');
            let close_price = response.data.data[j][6].replace(/,/g, '');
            let delta_price = response.data.data[j][7].replace(/,/g, '');
            let volume = response.data.data[j][8].replace(/,/g, '');
            let stockData = new Array();
            stockData.push(
                stockId,
                date,
                open_price,
                high_price,
                low_price,
                close_price,
                delta_price,
                transactions,
                volume,
                amount
            );

            // IGNORE，可以避免 primary key 欄位重複資料
            // 因此不需要先抓出來在判斷有無該資料在存入
            await conn.queryAsync(
                `INSERT IGNORE INTO stock_price (stock_id, date, open_price, high_price, low_price, close_price, delta_price, transactions, volume, amount) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                stockData
            );
        }
        console.log(
            `status: success, 已將日期 ${currentDate} 的股票代碼 ${stockId} 新增至資料庫`
        );
    }
}

/********** 解析資料庫資料(擷取出 stockId) **********/
function parseDbData(dbStock) {
    let stockId = new Array();
    for (let i = 0; i < dbStock.length; i++) {
        stockId.push(dbStock[i]['stock_id']);
    }
    return stockId;
}

/********** aysnc/await **********/
(async function () {
    try {
        // 讀取 stock-multi.txt
        let stockIdFile = await fs
            .readFileAsync('stock-multi.txt', 'utf-8')
            .catch((err) => {
                throw `status: faild, 檔案讀取失敗, ${err}`;
            });
        stockIdFile = stockIdFile.split('\r\n');
        console.log('檔案內的 stockId: ', stockIdFile);

        // 對資料庫查詢
        await conn.connectAsync();
        let dbStock = await conn
            .queryAsync(`SELECT * FROM stock WHERE stock_id IN (?)`, [
                stockIdFile,
            ])
            .catch((err) => {
                throw `status: faild, 資料庫查詢失敗, ${err}`;
            });
        let dbStockId = parseDbData(dbStock);
        console.log('資料庫 stock table 的 stockId: ', dbStockId);

        // 過濾出沒有在資料庫的 stockId
        // P.S. 不能寫多行 {}，ref: https://www.tutorialspoint.com/filter-array-with-filter-and-includes-in-javascript
        let lackStockId = stockIdFile.filter(
            (allStockId) => !dbStockId.includes(allStockId)
        );
        console.log('缺少的 stockId: ', lackStockId);

        // 無缺少的 stockId 則印出資料庫內的資料
        if (lackStockId.length == 0) {
            console.log('status: ', 'success, 資料庫查詢成功');
            console.log('資料庫 stock table 資料:', dbStock);
        } else {
            // 有缺少的 stockId 則撈 API，將「股票代號、名稱」新增至資料庫
            for (let i = 0; i < lackStockId.length; i++) {
                let stockId = lackStockId[i];
                let response = await axios
                    .get(
                        `https://www.twse.com.tw/zh/api/codeQuery?query=${stockId}`
                    )
                    .catch((err) => {
                        throw `status: faild, 取得股票名稱 API 失敗, ${err}`;
                    });
                let suggestions = response.data.suggestions;
                stockId = suggestions[0].split(/\s+/)[0];
                stockName = suggestions[0].split(/\s+/)[1];

                if (stockId === '(無符合之代碼或名稱)') {
                    // 找不到股票代碼，則刪除 stockIdFile 內的股票代碼
                    stockId = lackStockId[i];
                    stockIdFile.splice(stockIdFile.indexOf(stockId), 1);
                    console.log(`找不到股票代碼 ${stockId}`);
                } else {
                    // 找到股票代碼，則新增至資料庫
                    await conn.queryAsync(
                        'INSERT INTO stock (stock_id, stock_name) VALUES(?, ?);',
                        [stockId, stockName]
                    );
                    console.log(
                        `status: success, 股票代碼 ${stockId}、股票名稱 ${stockName} 已新增至資料庫`
                    );
                }
            }
        }

        // 取得股票成交資訊，並新增至資料庫
        await insertTradingData(stockIdFile);
    } catch (e) {
        console.error('錯誤: ', e);
    } finally {
        connection.end();
    }
})();
