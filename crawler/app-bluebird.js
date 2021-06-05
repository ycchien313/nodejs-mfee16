const Promise = require("bluebird")
const fs = Promise.promisifyAll(require("fs"))
const mysql = require("mysql")
const axios = require("axios")
const connection = mysql.createConnection({
    host     : "localhost",
    user     : "root",
    password : "0000",
    database : "stock"
})
const conn = Promise.promisifyAll(connection);


/********** aysnc/await **********/
(async function(){
    try{
        // 對資料庫查詢
        await conn.connectAsync()
        let stockId = await fs.readFileAsync("stock.txt", "utf-8").catch((err) => {throw `status: faild, 檔案讀取失敗, ${err}`})
        let results = await conn.queryAsync(`SELECT stock_name FROM stock WHERE stock_id = ${stockId}`).catch((err) => {throw `status: faild, 資料庫查詢失敗, ${err}`})

        // 有資料則印出
        if(results.length > 0){
            console.log("status: ", "success, 資料庫查詢成功")
            console.log(results)
        }
        else{
            // 無資料則解析 API 並新增至資料庫
            let response = await axios.get(`https://www.twse.com.tw/zh/api/codeQuery?query=${stockId}`).catch((err) => {throw `status: faild, API 獲取失敗, ${err}`})
            let suggestions = response.data.suggestions
            stockId = suggestions[0].split(/\s+/)[0]
            stockName = suggestions[0].split(/\s+/)[1]
            await conn.queryAsync(`INSERT INTO stock (stock_id, stock_name) VALUES('${stockId}', '${stockName}')`)
            console.log("status: ", "success, 資料庫新增成功")
        }
        
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


/********** 處理錯誤 **********/
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