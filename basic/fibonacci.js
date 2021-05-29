function fibMethod1(n){
    if(n == 0) return f0
    else if(n == 1) return f1
    else{
        counter++
        return fn = fibMethod1(n - 1) + fibMethod1(n - 2)
    }
}

function fibMethod2(n){
    let f2 = null
    counter = 0
    if(n == 0) return f0
    if(n == 1) return f1
    for(let i = 2; i <= n; i++){
        counter++
        f2 = f1 + f0
        f0 = f1
        f1 = f2
    }
    return f2
}


let counter = 0
let f0 = 0
let f1 = 1
let n = 10


console.log(`fibMethod1(${n}): `, fibMethod1(n))
console.log("counter of method1: ", counter)

console.log(`fibMethod2(${n}): `, fibMethod2(n))
console.log("counter of method2: ", counter)