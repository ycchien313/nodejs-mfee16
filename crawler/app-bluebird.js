const axios = require("axios")
const fs = require("fs")
// 取名為 Promise 用以取代原生的 Promise，以免用到
const Promise = require("bluebird")


// 把 fs.readFile function 包起來
let readFile = Promise.promisify(fs.readFile)

// 把 fs 所有的 function 都包成 promise
// let getStockData = Promise.promisifyAll(fs)

// let getStockData = Promise.promisify(fs.readFile)("stock.txt", "utf-8")


// get data of twse API
function getTwseData() {
    // getStockData
    readFile("stock.txt", "utf-8")
        .then((value) => {
            let stockNo = null
            stockNo = value //股票代碼

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
            })
        .then((response) => {
            // let stockList =  new Array()
            // let data = new Object()

            // let resDataLen = response.data.data.length
            // let stockNo = response.data["title"].split(/\s+/)[1]
            // let stockName = response.data["title"].split(/\s+/)[2]
            // let tradingDate = response.data["date"]
            // let closingPrice = response.data.data[resDataLen - 1][6]
            // data.stockNo = stockNo
            // data.stockName = stockName
            // data.tradingDate = tradingDate
            // data.closingPrice = closingPrice
            // stockList.push(data)
            // console.log(stockList)

            // let stockName = response.data["title"].split(/\s+/)[2]
            // console.log(`股票名稱：${stockName}`)
            console.log(response.data)
        })
        .catch((err) => {
            console.log(`讀檔錯誤：${err}`)
        })
}


getTwseData()