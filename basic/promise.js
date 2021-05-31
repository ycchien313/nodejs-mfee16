/*********  Usage of Promise (同步)  ********/
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


/*********  Usage of Promise.all, Promise.race (非同步) ********/
let doWorkPromise = function(job, timer, success){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let dt = new Date()
            if(success) return resolve(`完成工作：${job} at ${dt.toISOString()}`)
            reject(`工作失敗：${job} at ${dt.toISOString()}`)
        }, timer)
    })
}

let dt = new Date()
console.log(`開始工作：at ${dt.toISOString()}`)

let p1 = doWorkPromise("刷牙", 2000, true)
let p2 = doWorkPromise("吃早餐", 3000, true)
let p3 = doWorkPromise("寫功課", 2000, true)

/* 同時執行 */
Promise.all([p1, p2, p3])
    .then((values) => {
        console.log(values)
    })

/* 同時執行，並印出狀態 */
Promise.allSettled([p1, p2, p3])
    .then((values) => {
        console.log(values)
    })

// /* 當其中一個跑完，就停止執行(看誰跑得快) */
Promise.race([p1, p2, p3])
    .then((value) => {
        console.log(value)
    })