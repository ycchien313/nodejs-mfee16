function sum(n){
    let sum = 0
    for(let i=1; i<=n; i++){
        sum += i
    }
    return sum
}

console.log(sum(1))
console.log(sum(2))
console.log(sum(10))
console.log(sum(100000))