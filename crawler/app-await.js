const axios = require("axios")
const fs = require("fs")


let getStockNo = new Promise((resolve, reject) => {
    fs.readFile("stock.txt", "utf8", (err, data) => {
        err != null ? reject(err) : resolve(data)
    })
})


async function getTwseData() {
    let stockNo = null

    try {
        stockNo = await getStockNo
    } catch (err) {
        console.log("讀檔失敗", err)
        return
    }

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
            let stockName = response.data["title"].split(/\s+/)[2]
            console.log(`股票名稱：${stockName}`)
        })

}


getTwseData()