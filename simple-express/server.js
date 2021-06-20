const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs/promises');
const db = require('./utils/db.js');
const stockRouter = require('./routes/stock');
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');
const memberRouter = require('./routes/member');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
require('dotenv').config();

// app.use((req, res, next) => {
//     console.log('before next');
//     next();
// });

// app.use((req, res, next) => {
//     let current = new Date();
//     console.log(`有人來訪問了喔 在 ${current}`);
//     next();
// });

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
    expressSession({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
    })
);

// 設定靜態資源
// 只要是靜態資源就會從 public 進入
app.use(express.static('public'));

app.use(function (req, res, next) {
    res.locals.member = req.session.member;
    console.log(res.locals);
    next();
});

app.use('/stock', stockRouter);
app.use('/api/', apiRouter);
app.use('/auth/', authRouter);
app.use('/member', memberRouter);

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

// 找不到網頁
app.use(function (req, res, next) {
    res.status(404);
    res.render('404');
});

// 500，伺服器內部錯誤
app.use(function (err, req, res, next) {
    console.error('STATUS: 錯誤，', err);
    res.status(500);
    res.send('500 - Internal Sever Error 請洽系統管理員');
});

app.listen(port, () => {
    console.log(`simple-express app listening at http://localhost:${port}`);
    db.conn.connectAsync();
});
