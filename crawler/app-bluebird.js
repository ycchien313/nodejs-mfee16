const Promise = require("bluebird")
const fs = Promise.promisifyAll(require("fs"))
const moment = require("moment")
const mysql = require("mysql")
const axios = require("axios")
require("dotenv").config()
const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    // port     : process.env.DB_PORT,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
})
const conn = Promise.promisifyAll(connection);


/********** 一次寫入多筆股票資料用 **********/
async function insertMultiStockData(stockId, resDayLen, response){
    for(let i = 0; i < resDayLen; i++){
        let date = parseInt(response.data.data[i][0].replace(/\//g, "")) + 19110000
        let transactions = response.data.data[i][1].replace(/,/g, "")
        let amount = response.data.data[i][2].replace(/,/g, "")
        let open_price = response.data.data[i][3].replace(/,/g, "")
        let high_price = response.data.data[i][4].replace(/,/g, "")
        let low_price = response.data.data[i][5].replace(/,/g, "")
        let close_price = response.data.data[i][6].replace(/,/g, "")
        let delta_price = response.data.data[i][7].replace(/,/g, "")
        let volume = response.data.data[i][8].replace(/,/g, "")
        let stockData = new Array()
        stockData.push(stockId, date, open_price, high_price, low_price, close_price, delta_price, transactions, volume, amount)
        conn.queryAsync(`INSERT IGNORE INTO stock_price (stock_id, date, open_price, high_price, low_price, close_price, delta_price, transactions, volume, amount) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, stockData)
    }
}


/********** aysnc/await **********/
(async function(){
    try{
        // 讀取 stock.txt
        let stockId = await fs.readFileAsync("stock.txt", "utf-8").catch((err) => {throw `status: faild, 檔案讀取失敗, ${err}`})

        // 對資料庫查詢
        await conn.connectAsync()
        let results = await conn.queryAsync(`SELECT stock_name FROM stock WHERE stock_id = ?`, [stockId]).catch((err) => {throw `status: faild, 資料庫查詢失敗, ${err}`})

        // 有資料則印出
        if(results.length > 0){
            console.log("status: ", "success, 資料庫查詢成功")
            console.log(results)
        }
        else{
            // 無資料則查詢股票名稱，並新增至資料庫
            let response = await axios.get(`https://www.twse.com.tw/zh/api/codeQuery?query=${stockId}`).catch((err) => {throw `status: faild, 取得股票名稱 API 失敗, ${err}`})
            let suggestions = response.data.suggestions
            stockId = suggestions[0].split(/\s+/)[0]
            stockName = suggestions[0].split(/\s+/)[1]
            await conn.queryAsync(`INSERT INTO stock (stock_id, stock_name) VALUES('${stockId}', '${stockName}')`)
            console.log("status: ", "success, 資料庫新增成功")
        }
        
        // 取得股票當日成交資訊，假日則取最後成交日
        let currentDate = moment().format("YYYYMMDD")
        let response = await axios.get(`https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=${currentDate}&stockNo=${stockId}`).catch((err) => {throw `status: faild, 取得股票成交資訊 API 失敗, ${err}`})
        let resDayLen = response.data.data.length
        let date = parseInt(response.data.data[resDayLen - 1][0].replace(/\//g, "")) + 19110000
        let transactions = response.data.data[resDayLen - 1][1].replace(/,/g, "")
        let amount = response.data.data[resDayLen - 1][2].replace(/,/g, "")
        let open_price = response.data.data[resDayLen - 1][3].replace(/,/g, "")
        let high_price = response.data.data[resDayLen - 1][4].replace(/,/g, "")
        let low_price = response.data.data[resDayLen - 1][5].replace(/,/g, "")
        let close_price = response.data.data[resDayLen - 1][6].replace(/,/g, "")
        let delta_price = response.data.data[resDayLen - 1][7].replace(/,/g, "")
        let volume = response.data.data[resDayLen - 1][8].replace(/,/g, "")
        let stockData = new Array()
        stockData.push(stockId, date, open_price, high_price, low_price, close_price, delta_price, transactions, volume, amount)

        // IGNORE，可以避免 primary key 欄位重複資料
        // 因此不需要先抓出來在判斷有無該資料在存入
        await conn.queryAsync(`INSERT IGNORE INTO stock_price (stock_id, date, open_price, high_price, low_price, close_price, delta_price, transactions, volume, amount) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, stockData).catch((err) => {throw `status: faild, 資料庫寫入失敗, ${err}`})

        
        // 寫入多筆資料用
        // await insertMultiStockData(stockId, resDayLen, response)
    }catch(e){
        console.error("catch: ", e)
    }finally{
        connection.end()
    }
})()





/********** then(){}catch(){} **********/
// let stockId = null

// // 讀 stock.txt 檔
// fs.readFileAsync("stock.txt", "utf-8")
//     .then((contents) => {
//         stockId = contents
//         // 對資料庫查詢
//         return db.queryAsync(`SELECT stock_name FROM stock WHERE stock_id = '${stockId}'`)
//     })
//     .then((results) => {
//         if(results.length > 0)
//             // 有資料則印出
//             console.log(results[0].stock_name)
//         else{
//             // 無資料則讀 API
//             return axios.get(`ttps://www.twse.com.tw/zh/api/codeQuery?query=${stockId}`)
//         }
//     })
//     .then((response) => {
//         // 將 API 結果解析出股票代號、股票名稱，並寫入資料庫
//         let suggestions = response.data.suggestions
//         let stockId = suggestions[0].split(/\s+/)[0]
//         let stockName = suggestions[0].split(/\s+/)[1]
//         return db.queryAsync(`INSERT INTO stock (stock_id, stock_name) VALUES ('${stockId}', '${stockName}');`)
//     })
//     .then(() => {
//         console.log("status: ", "success, 資料庫新增成功")
//     })
//     .catch((e) => {
//         console.error("status: ", `faild, ${e}`)
//     })
//     .finally(() => {
//         connection.end()
//     })



/********** 處理錯誤(未完成) **********/
// function wrapper(promise){
//     return promise()
//         .then((res) => [null, res])
//         .catch((err) => [err, null])
// }

// function getStockId(){
//     return new Promise(() => {
//         fs.readFileAsync("stock.txt", "utf-8", (err, data) => {
//             err != null ? reject(err) : resolve(data)
//         })
//     })
// }
// function getStockId(){
//     return fs.readFileAsync("stock.txt", "utf-8")
//         .then(data => {
//             console.log(data)
//         })
//         .catch(err => {
//             console.log(err)
//         })
// }

// (async function(){
//     let [err, res] = await wrapper(getStockId)
//     console.log(err)
//     console.log(res)
//     // console.log(await getStockId())
// })()