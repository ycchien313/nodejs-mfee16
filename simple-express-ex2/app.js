const express = require('express');
const authRoute = require('./routes/auth');
const memberRoute = require('./routes/member');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const db = require('./utils/db');
const conn = db;
const app = express();
const port = 3000;

// 前端送 json data 時, express 才能解析
// app.use(express.json());

// 內建中間件；為了解析 POST 參數；extended: true 則可以使用 qs 套件
app.use(express.urlencoded({ extended: false }));
// cookie-parse 中間件；解析 cookie 標頭用
app.use(cookieParser());
// session 中間件；中間件擺放順序很重要，要在 router 前
app.use(
    expressSession({
        secret: process.env.SESSION_SECRET,
        resave: false,
    })
);

// views 相關設定 (兩者皆有預設)
app.set('views', 'views'); // 設定 views 的目錄
app.set('view engine', 'pug'); // 設定 template enginer

// 內建中間件；設定靜態目錄
app.use(express.static('public'));
// 其他路由傳回來的 session，存至 locals，讓 views 取用
app.use((req, res, next) => {
    // 存在 res.locals 就可以讓 views 拿到資料(ex. res.locals.member 的 member)
    // locals 是 response 物件提供的一個屬性
    res.locals.member = req.session.member;
    next();
});

app.use((req, res, next) => {
    // 登入訊息存一次讓 views 使用到，顯示一次即可，隨即刪除
    if (req.session.message) {
        res.locals.message = req.session.message;
        delete req.session.message;
    }
    next();
});

/********** 各路由位址 **********/
// 路由器中間件；設定 /routes/auth 的路由
app.use('/auth', authRoute);
// 路由器中間件；設定 /routes/member 的路由
app.use('/member', memberRoute);
// 首頁
app.get('/', (req, res) => {
    console.log('Cookie: ', req.cookies);
    console.log(__dirname);
    console.log(`STATUS: 成功，導向至首頁 ${req.originalUrl}`);
    res.render('index');
});
// 404 錯誤
app.use((req, res, next) => {
    res.sendStatus(404);
});
// 其他錯誤
app.use((err, req, res, next) => {
    console.log('app.use', err);
    // res.status(res.statusCode).send(JSON.stringify(err))
});

app.listen(port, () => {
    console.log(
        `STATUS: 成功，伺服器已啟動，請連線至 http://127.0.0.1:${port}`
    );
    conn.connect();
});
