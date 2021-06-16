const http = require("http")
const { URL } = require("url") //解構賦值
// const fs = require("fs")
const fs = require("fs/promises")

const server = http.createServer(async (req, res) => {
    if(req.url != "/favicon.ico"){
        console.log("status: 連線成功，Now the server is listening on port 3000")
        
        // 建立完整 URL
        const url = new URL(req.url.toLowerCase(), `http://${req.headers.host.toLowerCase()}`)

        // 解析 url
        const {host, pathname, search} = url
        let query = search.replace(/\?/, "")
        let queryObj = new Object()
        let key = query.replace(/=.*/, "")
        let value = query.replace(/.*?=/, "")
        queryObj[key] = value

        // 使中文正常顯示
        res.setHeader("Content-Type", "text/html;charset=UTF-8")

        // 路由 route
        switch(pathname){
            case "":
            case "/":
                res.write("首頁")
                break

            case "/test":
                const loadPage = await fs.readFile("test.html")
                res.write(loadPage)
                break


                /********** fs/Promise **********/
                // await fs.readFile("test.html", (err, data) => {
                //     if(err != null) reject(err)
                //     else resolve(data)
                // })
                // .then((value) => {
                //     res.write(value)
                // })
                // .catch((err) => {
                //     res.write(err)
                // })
                // res.end()
                // break


                /********** Promise **********/
                // await new Promise((resolve, reject) => {
                //     fs.readFile("test.html", (err, data) => {
                //         if(err != null) reject(err)
                //         resolve(data)
                //     })
                // })
                // .then((value) => {
                //     console.log("value: ", value)
                //     res.write(value)
                //     res.end()
                // })
                // .catch((err) => {
                //     console.log(err)
                // })
                // break
                
            case "/about":
                res.write(`Hi ${queryObj["name"]}`)
                break
                
                /********** URL.searchParams **********/
                // url.searchParams.set(["name"], "bbb")
                // res.write(url.searchParams.get("name")) //bbb
                // break
    
            default:
                res.writeHead("404")
                res.write("404 找不到網頁")
                break
        }

        res.end()
    }
})

server.listen(3000, () => {
    console.log("Please listen on port 3000")
})
