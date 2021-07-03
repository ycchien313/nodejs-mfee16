const express = require('express');
const router = express.Router();
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));
const { body, validationResult } = require('express-validator');
const db = require('../utils/db');
const conn = db;
const path = require('path');
const multer = require('multer');

/********** 檔案上傳路徑 **********/
// 設定上傳檔案的完整儲存目錄(含目錄路徑、檔案名稱)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../', 'public', 'uploads'));
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    },
});

/********** 驗證規則 **********/
// 註冊規則
const registerRules = [
    body('name').notEmpty().withMessage('姓名格式錯誤'),
    body('email').isEmail().withMessage('Email 格式錯誤'),
    body('password').isLength({ min: 3 }).withMessage('密碼格式錯誤'),
    body('confirmPassword')
        .custom((value, { req }) => {
            return value === req.body.password;
        })
        .withMessage('密碼不同，請重新輸入'),
];
// 登入規則
const loginRules = [
    body('email').notEmpty().withMessage('請輸入帳號'),
    body('email').isEmail().withMessage('Email 格式錯誤'),
    body('password').notEmpty().withMessage('請輸入密碼'),
];

/********** middleware **********/
// multer 中間件；處理上傳檔案
const upload = multer({
    // 指定存取位置
    storage: storage,
    // 副檔名篩選
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('不合格的附檔名'));
        }
        cb(null, true);
    },
    // 設定檔案大小上限，1MB
    limit: {
        fileSize: 1024 * 1024,
    },
});

/********** router 主程式 **********/
// 註冊頁面
router.get('/register', (req, res) => {
    console.log(`STATUS: 成功，導向至註冊頁 ${req.originalUrl}`);
    res.render('../views/auth/register');
});

// 注：要先讓 multer(upload) 讀取處裡圖片格式，express-validator(registerRules) 才不會發生錯誤，所以參數要置於 rule 之前
// 取得 post 資料，必須加入 express.urlencoded 中間件(server.js)
router.post(
    '/register',
    upload.single('photo'),
    registerRules,
    async (req, res) => {
        // 檢查表單輸入資料之格式
        const validationErrors = validationResult(req);

        // 表單填寫有誤
        if (!validationErrors.isEmpty()) {
            console.error(`STATUS: 錯誤，400，表單輸入有錯誤`);
            return res.status(400).json({ errors: validationErrors.array() });
        }

        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const photo = req.file ? `/uploads/${req.file.filename}` : null;

        // 檢查 email 是否重複註冊
        const member = await conn.queryAsync(
            'SELECT * FROM members WHERE email = ?',
            email
        );
        if (member.length > 0) {
            console.error(`STATUS: 錯誤，400，此 email 已有人使用`);
            return res
                .status(400)
                .json({ errors: { msg: '此 email 已有人使用' } });
        }

        // 對密碼進行加密
        const hash = await bcrypt.hashAsync(password, 10);
        const registerData = [name, email, hash, photo];
        await conn.queryAsync(
            'INSERT INTO members(name, email, password, photo) VALUES(?)',
            [registerData]
        );
        console.log(`STATUS: 成功，已將 ${email} 新增置資料庫`);

        return res.redirect(303, '/auth/login');
    }
);

// 登入頁面
router.get('/login', (req, res) => {
    console.log(`STATUS: 成功，導向至登入頁 ${req.originalUrl}`);
    res.render('auth/login');
});

// 取得 post 資料，必須加入 express.urlencoded 中間件(server.js)
router.post('/login', loginRules, async (req, res, next) => {
    // 檢查表單輸入資料之格式
    const validationErrors = validationResult(req);

    // 表單填寫有誤
    if (!validationErrors.isEmpty()) {
        console.error(`STATUS: 錯誤，400，表單輸入有誤`);
        return res.status(400).json({ errors: validationErrors.array() });
    }

    const email = req.body.email;
    const password = req.body.password;
    const member = await conn.queryAsync(
        'SELECT * FROM members WHERE email = ?',
        email
    );
    console.log(`登入Email: ${email}`);
    console.log(`登入密碼: ${password}`);

    // 檢查資料庫內有無此 email
    if (member.length == 0) {
        console.error(`STATUS: 錯誤，303，資料庫內無此帳號`);
        res.statusCode = 303;
        return next(new Error(`title: 登入失敗, message: 帳號密碼錯誤`));
    }

    const name = member[0].name;
    const photo = member[0].photo;
    const hash = member[0].password;
    console.log(`加密密碼: ${hash}}`);

    // 明文密碼與加密密碼比對
    await bcrypt.compareAsync(password, hash, (err, result) => {
        if (result) {
            // 把會員資訊 session 存在 member 物件
            req.session.member = {
                email: email,
                name: name,
                photo: photo,
            };

            // 把登入資訊 session 存在 message 物件
            req.session.message = {
                title: '已登入',
                text: '登入成功，歡迎回來',
            };
            res.redirect(303, '/');
        } else {
            console.error(`STATUS: 錯誤，303，密碼錯誤`);
            res.redirect(303, '/auth/login');
        }
    });
});

router.get('/logout', (req, res) => {
    console.log(`STATUS: 成功，導向至登出頁 ${req.originalUrl}`);
    req.session.member = null;
    req.session.message = {
        title: '已登出',
        text: '歡迎再回來~',
    };
    res.redirect(303, '/');
});

module.exports = router;
