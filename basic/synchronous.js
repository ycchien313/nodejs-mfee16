/*********  synchronous.js  ********/
/*
此程式碼為「同步」之使用方式，並以以下三種為例
1. (Line 44) Callback Hell
2. (Line 68) Promise
3. (Line 107) Async/Await
 */


/*********  同步/非同步  ********/
/*
圖片參考：https://drive.google.com/file/d/1fGHwvGpJZL9Z_TBD4zCswr67rRuyrVMh/view?usp=sharing
同步(Synchronous)：一次只做一件事，任務依序執行
非同步(Asynchronous)：一次做多件事，任務同時執行

P.S. PC中的同步與中文的同步「意思不同」
*/


/*********  Callback 執行步驟  ********/
/* 
let doWork = function(job, timer, cb){
    //step 2.
    setTimeout(() => {
        let dt = new Date()
        //step 3.
        cb(null, `完成工作：${job} at ${dt.toISOString()}`)
        //step 6.
    }, timer)
}

let dt = new Date()
console.log(`開始工作：at ${dt.toISOString()}`)
//step 1.
doWork("刷牙", 2000, function(err, result){
    //step 4.
    err != null ? console.log("錯誤：", err) : console.log(result)
    //step 5.
}) 
*/



/*********  Synchronous Method 1 - Callback Hell  ********/
/* 最基本同步方式，程式碼很醜，且不易看懂 */

let doWork = function(job, timer, cb){
    setTimeout(() => {
        let dt = new Date()
        cb(null, `完成工作：${job} at ${dt.toISOString()}`)
    }, timer)
}

let dt = new Date()
console.log(`開始工作：at ${dt.toISOString()}`)
doWork("刷牙", 2000, function(err, result){
    err != null ? console.log("錯誤：", err) : console.log(result)
    doWork("吃早餐", 3000, function(err, result){
        err != null ? console.log("錯誤：", err) : console.log(result)
        doWork("寫功課", 2000, function(err, result){
            err != null ? console.log("錯誤：", err) : console.log(result)
        })
    })
})



/*********  Synchronous Method 2 - Promise  ********/
/* 使用 Promise 達成同步之方法，可以改善 Callback Hell */

// let doWorkPromise = function(job, timer, success){
//     return new Promise((resolve, reject) => {    //此 return 為回傳 Promise 物件
//         setTimeout(() => {
//             let dt = new Date()
//             if(success) return resolve(`完成工作：${job} at ${dt.toISOString()}`)
//             reject(`工作失敗：${job} at ${dt.toISOString()}`)
//         }, timer)
//     })
// }

// let dt = new Date()
// console.log(`開始工作：at ${dt.toISOString()}`)
// doWorkPromise("刷牙", 2000, true)
//     .then((value) => {
//         console.log(value)
//         return doWorkPromise("吃早餐", 3000, true)   //此 return 讓下一個 then 取得 doWorkPromise("吃早餐", 3000, true) 的值並使用
//     })
//     .then((value) => {
//         console.log(value)
//         return doWorkPromise("寫功課", 2000, true)   //因 return 的值為 Promise 物件，所以依序此流程可以達到「synchronous」控制
//     })
//     .then((value) => {
//         console.log(value)
//     })
//     .then((value) => {
//         console.log("沒有回傳 Promise，所以變成非同步了")
//     })
//     .then((value) => {
//         console.log("沒有回傳 Promise，所以變成非同步了")
//     })
//     .catch((err) => {
//         console.error("錯誤：", err)
//     })



/*********  Synchronous Method 3 - async/await ********/
/* 使用 async/await 達成同步之方式，改善 Promise 同步方法，並達到較佳之可讀性*/
/* async/await 仍為 Promise base */

// let doWorkPromise = function(job, timer, success){
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             let dt = new Date()
//             if(success) return resolve(`完成工作：${job} at ${dt.toISOString()}`)
//             reject(`工作失敗：${job} at ${dt.toISOString()}`)
//         }, timer)
//     })
// }

// let dt = new Date()
// console.log(`開始工作：at ${dt.toISOString()}`);
// (async function(){
//     try{
//         let p1 = await doWorkPromise("刷牙", 2000, true)
//         let p2 = await doWorkPromise("吃早餐", 3000, true)
//         let p3 = await doWorkPromise("寫功課", 2000, true)

//         console.log("await", p1)
//         console.log("await", p2)
//         console.log("await", p3)
//     } catch(err){
//         console.error("錯誤", err)
//     } finally{
//         console.log("任務完成")
//     }
// }())

