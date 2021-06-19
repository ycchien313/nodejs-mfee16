const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs/promises');
const db = require('./utils/db.js');
const stockRouter = require('./routes/stock');
const apiRouter = require("./routes/api")

// app.use((req, res, next) => {
//     console.log('after next');
//     next();
// });

// app.use((req, res, next) => {
//     console.log('before next');
//     next();
// });

// 不懂 next 的意義 ...
// app.use((req, res, next) => {
//     let current = new Date();
//     console.log(`有人來訪問了喔 在 ${current}`);
//     next();
// });

// 設定靜態資源
// 只要是靜態資源就會從 public 進入
app.use(express.static('public'));

app.use('/stock', stockRouter);
app.use('/api/', apiRouter)

// 設定動態資源
app.set('views', 'views');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index');
    res.end();
    // console.log(req.url);
    // console.log(res.header);
});

app.get('/test', async (req, res) => {
    const page = await fs.readFile('test.html');
    res.write(page);
    res.end();
});

app.get('/about', (req, res) => {
    // let name = req.query['name'];
    // res.send(`Hi ${name}`);
    res.render('about');
    res.end();
});

app.listen(port, () => {
    console.log(`simple-express app listening at http://localhost:${port}`);
    db.conn.connectAsync();
});
