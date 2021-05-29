const axios = require('axios')

axios({
        method: "get",
        // url: "https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20210528&stockNo=2330&_=1622187642107",
        responseType: "json",
        url: "https://www.twse.com.tw/exchangeReport/STOCK_DAY?",
        params: {
            response : "json",
            date : "20210528",
            stockNo : "2330"
        }
    })
    .then(function(response){
        let stockList =  new Array()
        let data = new Object()

        let resDataLen = response.data.data.length
        let stockId = response.data["title"].split(/\s+/)[1]
        let stockName = response.data["title"].split(/\s+/)[2]
        let tradingDate = response.data["date"]
        let closingPrice = response.data.data[resDataLen - 1][6]
        data.stockId = stockId
        data.stockName = stockName
        data.tradingDate = tradingDate
        data.closingPrice = closingPrice
        stockList.push(data)
        console.log(stockList)
    })