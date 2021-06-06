const http = require("http")


const server = http.createServer((req, res) => {
    console.log("連線成功")
    res.setHeader("Content-Type", "text/plain;charset=UTF-8")
    switch(req.url){
        case "/":
            res.write("首頁")
            res.end()
            break
        case "/test"
        
    }
        
})

server.listen(3000, () => {
    console.log("請用 3000 port")
})