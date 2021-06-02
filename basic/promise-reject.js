let doWorkPromise = function(job, timer, success){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let dt = new Date()
            if(success) resolve(`完成工作：${job} at ${dt.toISOString()}`)
            reject(`工作失敗：${job} at ${dt.toISOString()}`)
        }, timer)
    })
}

let dt = new Date()
console.log(`開始工作：at ${dt.toISOString()}`)


// doWorkPromise("刷牙", 2000, true)
//     .then((result) => {
//         console.log(result)
//         return doWorkPromise("吃早餐", 3000, false)
//     })
//     .catch((err) => {
//         console.error("(錯誤1)", err)
//         return new Promise((resolve) => {resolve()})
//     })
//     .then((result) => {
//         console.log(result)
//         return doWorkPromise("寫功課", 2000, true)
//     })
//     .then((result) => {
//         console.log(result)
//     })
//     .catch((err) => {
//         console.error("(錯誤2)", err)
//     })


doWorkPromise("刷牙", 2000, true)
    .then(
        (resolve) => {
            console.log(resolve)
            // let a = null
            // a.b()
            return doWorkPromise("吃早餐", 3000, false)
        }, (reject) => {
            console.log(reject)
            return doWorkPromise("吃早餐", 3000, false)
        }
    )
    // .catch((err) => {
    //     console.error("catch1: ", err)
    //     let a = null
    //     a.b()
    //     return doWorkPromise("catch1 寫功課", 3000, false)
    // })
    .then(
        (resolve) => {
            console.log(resolve)
            // return doWorkPromise("resolve 寫功課", 2000, true)
        }, (reject) => {
            console.log("reject: ", reject)
            return doWorkPromise("寫功課", 2000, false)
        }
    )
    .then((resolve) => {
        console.log("resolve: ", resolve)
    }, (reject) => {
        console.log("reject: ", reject)
    })
    .catch((err) => {
        console.error("發生錯誤", err);
    })
    