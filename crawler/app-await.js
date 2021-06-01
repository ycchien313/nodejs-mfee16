const axios = require("axios")
const fs = require("fs")
const moment = require("moment")


/********** 取得 stock.txt 的股票代碼 **********/
let getStockNo = function(){
    return new Promise((resolve, reject) => {
        fs.readFile("stock.txt", "utf8", (err, data) => {
            err != null ? reject(err) : resolve(data)
        })
    })
}


/********** 取得日期 **********/
let getDate = function(){
    return new Promise((resolve, reject) => {
        let currentDate = null
        currentDate = moment().format("YYYYMMDD")
        try {resolve(currentDate)}
        catch(err){reject(err)}
    })
}


/********** 向 Twse API 請求 **********/
let requestTwse = function(stockNo, date){
    return axios({
        method: "get",
        responseType: "json",
        url: "https://www.twse.com.tw/exchangeReport/STOCK_DAY?",
        params: {
            response: "json",
            date: date,
            stockNo: stockNo
        }
    })
}


/********** Response of Twse API **********/
async function getTwseData(){
    let stockNo = null
    let date = null
    let responseTwse = null
    let twseData = null
    
    stockNo = await getStockNo()
    date = await getDate()
    responseTwse = await requestTwse(stockNo, date)
    twseData = responseTwse.data

    return twseData
}


/********** 處理 Twse Data **********/
async function handleTwseData(){
    let twseData = null
    let stat = null
    let stockName = null

    twseData = await getTwseData()
    stat = twseData["stat"] //取得資料狀態

    if(stat != "OK") console.log(stat)
    else{
        stockName = twseData["title"].split(/\s+/)[2]
        console.log(`股票名稱：${stockName}`)
    }
}


handleTwseData()

