let doWorkPromise = function(job, timer, success){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(success) resolve(`完成工作：${job} at ${dt.toISOString()}`)
            else reject(`工作失敗：${job} at ${dt.toISOString}`)
        }, timer)
        let dt = new Date()
    })
}

let dt = new Date()
console.log(`開始工作：at ${dt.toISOString()}`)

doWorkPromise("刷牙", 2000, true)
    .then((result, result2) => {
        console.log(result)
    })