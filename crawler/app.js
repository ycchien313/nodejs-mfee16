const axios = require("axios")
const fs = require("fs")

// function getStockNo(){
//     return new Promise((resolve, reject) => {
//         fs.readFile("stock.txt", "utf8", (err, data) => {
//             err != null ? reject(err) : resolve(data)
//         })
//     })
// }

let getStockNo = new Promise((resolve, reject) => {
    fs.readFile("stock.txt", "utf8", (err, data) => {
        err != null ? reject(err) : resolve(data)
    })
})

function getTwseData() {
    getStockNo
        .then((result) => {
            let stockNo = null
            stockNo = result //股票代碼

            axios({
                    method: "get",
                    responseType: "json",
                    url: "https://www.twse.com.tw/exchangeReport/STOCK_DAY?",
                    params: {
                        response: "json",
                        date: "20210528",
                        stockNo: stockNo
                    }
                })
                .then(function (response) {
                    // let stockList =  new Array()
                    // let data = new Object()

                    // let resDataLen = response.data.data.length
                    // let stockNo = response.data["title"].split(/\s+/)[1]
                    // let stockName = response.data["title"].split(/\s+/)[2]
                    // let tradingDate = response.data["date"]
                    // let closingPrice = response.data.data[resDataLen - 1][6]
                    // data.stockId = stockId
                    // data.stockName = stockName
                    // data.tradingDate = tradingDate
                    // data.closingPrice = closingPrice
                    // stockList.push(data)
                    // console.log(stockList)

                    let stockName = response.data["title"].split(/\s+/)[2]
                    console.log(`股票名稱：${stockName}`)
                })
        })
        .catch((err) => {
            console.log(`讀檔錯誤：${err}`)
        })
}


getTwseData()