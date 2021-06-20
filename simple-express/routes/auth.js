const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt'); // 驗證規則
const multer = require('multer'); // 上傳檔案
const path = require('path');

const registerRules = [
    body('email').isEmail().withMessage('請輸入正確的 email 格式'),
    body('password').isLength({ min: 3 }),
    body('confirmPassword').custom((value, { req }) => {
        return value === req.body.password;
    }),
];

const loginRules = [
    body('email').isEmail(),
    body('password').isLength({ min: 3 }),
];

const myStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        // routes/auth.js -> 現在的位置
        // public/uploads -> 希望找到的位置
        // /routes/../public/uploads
        cb(null, path.join(__dirname, '../', 'public', 'uploads'));
    },
    filename: function (req, file, cb) {
        // 抓出副檔名
        const ext = file.originalname.split('.').pop();
        // 組合出自己想要的檔案名稱
        cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    },
});

const uploader = multer({
    storage: myStorage,
    fileFilter: function (req, file, cb) {
        // console.log(file);
        //if (file.mimetype !== "image/jpeg") {
        //  return cb(new Error("不合法的 file type"), false);
        //}
        // file.originalname: Name of the file on the user's computer
        // 101.jpeg
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('是不合格的副檔名'));
        }
        // 檔案ＯＫ, 接受這個檔案
        cb(null, true);
    },
    limits: {
        // 限制檔案的上限 1M
        fileSize: 1024 * 1024,
    },
});

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post(
    '/register',
    uploader.single('photo'),
    registerRules,
    async (req, res, next) => {
        const validateResult = validationResult(req);

        console.log(validateResult);
        if (validateResult.errors != '') {
            return next(new Error(`輸入錯誤，${validateResult}`));
        }

        const email = req.body.email;
        const password = await bcrypt.hash(req.body.password, 10);
        const name = req.body.name;
        const members = await db.conn.queryAsync(
            'SELECT * FROM members WHERE email = ?',
            email
        );
        if (members.length > 0) return res.send('此 email 已經註冊過了');

        let filepath = req.file ? '/uploads/' + req.file.filename : null;

        console.log(req.file);
        await db.conn.queryAsync(
            'INSERT INTO members (email, password, name, photo) VALUES(?)',
            [[email, password, name, filepath]]
        );

        res.send('恭喜註冊成功');
    }
);

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', loginRules, async (req, res, next) => {
    const email = req.body.email;
    const members = await db.conn.queryAsync(
        'SELECT * FROM members WHERE email = ?',
        email
    );

    const validateResult = validationResult(req);
    if (validateResult.errors != '') {
        return next(new Error(`輸入錯誤，${validateResult}`));
    }

    if (members.length == 0) res.send('無此帳號');

    // console.log(members[0].password)
    let result = await bcrypt.compare(req.body.password, members[0].password);

    if (result) {
        // 取得資料庫資料並存至後端 session
        req.session.member = {
            email: members[0].email,
            name: members[0].name,
            photo: members[0].photo,
        };

        res.redirect(303, '/');
        // res.send('登入成功');
    } else res.send('登入失敗');
});

router.post('/logout', (req, res) => {
    req.session.member = null
    res.redirect('/');
});

module.exports = router;
