const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs/promises');

// 不懂 next 的意義 ...
app.use((req, res, next) => {
    let current = new Date();
    console.log(`有人來訪問了喔 在 ${current}`);
    next();
});

// app.use((req, res, next) => {
//     console.log('after next');
//     next();
// });

// app.use((req, res, next) => {
//     console.log('before next');
//     next();
// });

app.get('/', (req, res) => {
    res.send('Hello World');
    res.end();
    console.log(req.url);
    console.log(res.header);
});

app.get('/test', async (req, res) => {
    const page = await fs.readFile('test.html');
    res.write(page);
    res.end();
});

app.get('/about', (req, res) => {
    let name = req.query['name'];
    res.send(`Hi ${name}`);
    res.end();
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
