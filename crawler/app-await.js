const axios = require("axios")
const fs = require("fs")


/********** 取得 stock.txt 的股票代碼 **********/
let getStockNo = function(){
    return new Promise((resolve, reject) => {
        fs.readFile("stock.txt", "utf8", (err, data) => {
            err != null ? reject(err) : resolve(data)
        })
    })
}


/********** 向 Twse API 請求 **********/
let requestTwse = function(stockNo){
    return axios({
        method: "get",
        responseType: "json",
        url: "https://www.twse.com.tw/exchangeReport/STOCK_DAY?",
        params: {
            response: "json",
            date: "20210528",
            stockNo: stockNo
        }
    })
}


/********** Response of Twse API **********/
async function getTwseData(){
    let stockNo = null
    let responseTwse = null
    let twseData = null
    stockNo = await getStockNo()
    responseTwse = await requestTwse(stockNo)
    twseData = responseTwse.data
    return twseData
}


/********** 處理 Twse Data **********/
async function handleTwseData(){
    let twseData = null
    let stockName = null
    twseData = await getTwseData()
    console.log(twseData)
    let stockName = twseData["title"].split(/\s+/)[2]
    console.log(`股票名稱：${stockName}`)
}


handleTwseData()