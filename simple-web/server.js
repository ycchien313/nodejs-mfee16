const http = require("http")


const server = http.createServer((req, res) => {
    console.log("連線成功")
    // 使中文正常顯示
    res.setHeader("Content-Type", "text/plain;charset=UTF-8")
    console.log(req.url)
    

    switch(req.url){
        case "/":
            res.write("首頁")
            res.end()
            break
        case "/test":
            res.write("test")
            res.end()
            break
    }
})

server.listen(3000, () => {
    console.log("請用 3000 port")
})