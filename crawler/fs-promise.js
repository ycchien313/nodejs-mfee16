const axios = require("axios")
const fs = require("fs/promises")

// 讀取 stock.txt 之股票代碼
let getStockData = function(){
    // return new Promise((resolve, reject) => {
    //     fs.readFile("stock.txt", "utf8", (err, data) => {
    //         err != null ? reject(err) : resolve(data)
    //     })
    // })
    return fs.readFile("stock.txt", "utf8", (err, data) => {
        returnerr != null ? reject(err) : resolve(data)
    })
}


// get data of twse API
function getTwseData() {
    getStockData()
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

            let stockName = response.data["title"].split(/\s+/)[2]
            console.log(`股票名稱：${stockName}`)
        })
        .catch((err) => {
            console.log(`讀檔錯誤：${err}`)
        })
}


getTwseData()