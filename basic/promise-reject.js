/*****************************************************************
 * 參考文章: https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
 *
 * 作法 1 跟 作法 2，為了不要互相干擾，我先把作法1 註解起來。
 *
 * 執行以下步驟:
 * 1. 執行看看這個程式，也就是目前的做法 2，觀察結果。
 * 2. 將作法2 中的 `// return doWorkPromise("寫功課", 5000, true);`  反註解，然後再執行一次，並且觀察結果。
 * 3. 將作法 2 整個註解掉，將作法1 反註解，執行程式，觀察結果。
 *
 * 最後，完成上述三個測試後，回答我以下兩個問題:
 * A. 比較上述三個測試的結果，你覺得差異為何？
 * B. 就程式結構來說，作法 1 跟 作法 2 哪個比較易讀跟好維護？
 ******************************************************************/

//  let doWorkPromise = function (job, timer, success) {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         let dt = new Date();
//         if (success) {
//           // 成功
//           return resolve(`完成工作: ${job} at ${dt.toISOString()}`);
//         }
//         reject(`!!工作失敗: ${job} at ${dt.toISOString()}`);
//       }, timer);
//     });
//   };
  
  // 刷完牙 > 吃早餐 > 寫功課
  // 作法 1
  // doWorkPromise("刷牙", 2000, true)
  //   .then((result) => {
  //     // fulfilled 處理成功 resolve
  //     console.log(result);
  //     return doWorkPromise("吃早餐", 3000, false);
  //   })
  //   // 測試3
  //   // .catch((err) => {
  //   //   // 這裡多加一個 catch，捕捉這個 catch 之前的錯誤
  //   //   // 最後仍會 return 一個 promise 讓下一個 then 繼續發生
  //   //   // 但因為沒有真的 return 什麼資料，所以下一個 then 的 result 會是 undefined
  //   //   console.log("中間的 catch 攔截", err);
  //   // })
    // .then((result) => {
    //   console.log("成功地吃早餐了嗎？", result);
    //   return doWorkPromise("寫功課", 5000, true);
    // })
    // .then((result) => {
    //   console.log(result);
    // })
    // .catch((err) => {
    //   // rejected 處理失敗 reject
    //   console.error("發生錯誤", err);
    // })
    // .finally(() => {
    //   console.log("我是 Finally");
    // });
  
  // 作法2
  // doWorkPromise("刷牙", 2000, true)
  //   .then(
  //     (result) => {
  //       // fulfilled 處理成功 resolve
  //       console.log(result);
  //       return doWorkPromise("吃早餐", 3000, false);
  //     },
  //     (reject) => {
  //       console.log("中途攔截A", reject);
  //     }
  //   )
  //   .then(
  //     (result) => {
  //       console.log(result);
  //       return doWorkPromise("寫功課", 5000, true);
  //     },
  //     (reject) => {
  //       console.log("中途攔截B", reject);
  //       // 試試看這行有註解 跟 沒註解的差異
  //       // return doWorkPromise("寫功課", 5000, true);
  //     }
  //   )
  //   .then(
  //     (result) => {
  //       console.log(result);
  //     },
  //     (reject) => {
  //       console.log("中途攔截C", reject);
  //     }
  //   )
  //   .catch((err) => {
  //     // rejected 處理失敗 reject
  //     console.error("發生錯誤", err);
  //   })
  //   .finally(() => {
  //     console.log("我是 Finally");
  //   });




/********** 個人測試 **********/
/* Answer：
 * 
 * 作法1. 多個 then((onFulfilled))，最後接1個 catch()
 * 作法2. 多個 then((onFulfilled), (onRejected))，最後接1個 catch()
 * 作法3. 1個 then((onFulfilled))、1個 catch() → 1個 then((onFulfilled))、1個 catch() ... 依此類推
 * 作法4. 1個 then((onFulfilled), (onRejected))、1個 catch() → 1個 then((onFulfilled), (onRejected))、1個 catch() ... 依此類推
 * 
 * resolve()，處於 fulfilled 狀態
 * reject()，處於 rejected 狀態
 * 狀態圖參考：https://cdn.rawgit.com/Vectaio/a76330b025baf9bcdf07cb46e5a9ef9e/raw/26c4213a93dee1c39611dcd0ec12625811b20a26/js-promise.svg
 * 
 * A.
 * 1. 於下方程式碼之註解上
 * 2. 總結：
 *    - resolve() callback 會進到 then((onFulfilled))
 *    - reject() callback 會進到最接近的 catch()，並跳過中間的 then()
 *    - reject() callback 會進到最接近的 catch()，優先於 then((onRejected))
 * 
 * B.
 * 以作法3.會是最好閱讀及維護
 */
let doWorkPromise = function(job, timer, success){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let dt = new Date()
            if(success) resolve(`完成工作：${job} at ${dt.toISOString()}`)
            else reject(`工作失敗：${job} at ${dt.toISOString()}`)
        }, timer)
    })
}

let dt = new Date()
console.log(`開始工作：at ${dt.toISOString()}`)


/********** 作法1 **********/
/* 多個 then((onFulfilled))，最後接1個 catch() 
 *
 * 執行後可以看到 doWorkPromise("吃早餐", 3000, false) 是進入 rejected 狀態，因此會被 catch() 攔截，而下一個 then() 無法執行
 * 
 */
doWorkPromise("刷牙", 2000, true)
  .then((result) => {
    console.log(result)
    return doWorkPromise("吃早餐", 3000, false)
  })
  .then((result) => {
    console.log(result)
    return doWorkPromise("寫功課", 2000, true)
  })
  .catch((err) => {
    console.error("catch ", err)
  })


/********** 作法2 **********/
/* 多個 then((onFulfilled), (onRejected))，最後接1個 catch() 
 *
 * 不論 resolve()、reject() callback 皆能順利執行
 * 如要每個 Promise 都執行到，then((onRejected)) 的時候也要加上 return doWorkPromise()
 * 改善 作法1
 * 
 */
// doWorkPromise("刷牙", 2000, true)
//   .then((resolve) => {
//       console.log("resolve ", resolve)
//       return doWorkPromise("吃早餐", 3000, false)
//     }, (reject) => {
//       console.log("reject ", reject)
//       return doWorkPromise("吃早餐", 3000, false)
//     }
//   )
//   .then((resolve) => {
//       console.log("resolve ", resolve)
//       return doWorkPromise("寫功課", 2000, true)
//     }, (reject) => {
//       console.log("reject ", reject)
//       return doWorkPromise("寫功課", 2000, true)
//     }
//   )
//   .then((resolve) => {
//       console.log("resolve ", resolve)
//     }, (reject) => {
//       console.log("reject ", reject)
//     }
//   )
//   .catch((err) =>{
//     console.error("catch ", err)
//   })


/********** 作法3 **********/
/* 1個 then((onFulfilled))、1個 catch() → 1個 then((onFulfilled))、1個 catch() ... 依此類推
 *
 * 不論 resolve()、reject() callback 皆能順利執行
 * 當 reject() callback 的時候，會進入接下來的 catch()，而下一個 then() 仍會順利執行，改善作法1
 * 作法3之寫法較好閱讀與維護，改善作法2
 * 
 */
// doWorkPromise("刷牙", 2000, true)
//   .then((result) => {
//     console.log("resolve ", result)
//     return doWorkPromise("吃早餐", 3000, false)
//   })
//   .catch((err) => {
//     console.error("catch", err)
//   })
//   .then((result) => {
//     console.log("resolve ", result)
//     return doWorkPromise("寫功課", 2000, true)
//   })
//   .catch((err) => {
//     console.error("catch", err)
//   })
//   .then((result) => {
//     console.log("resolve ", result)
//   })
//   .catch((err) => {
//     console.error("catch", err)
//   })
  

/********** 作法4 **********/
/* 1個 then((onFulfilled), (onRejected))、1個 catch() → 1個 then((onFulfilled), (onRejected))、1個 catch() ... 依此類推
 *
 * 不論 resolve()、reject() callback 皆能順利執行
 * 當 reject() callback 的時候，會進入接下來的 catch()，而下一個 then() 仍會順利執行，改善作法1
 * 不需要在 then((onRejected)) 的時候也加上 return doWorkPromise()，改善作法2
 * 作法4不易閱讀與維護，且 then((onRejected)) 也變得沒有功用
 * 
 */
// doWorkPromise("刷牙", 2000, true)
//   .then((resolve) => {
//       console.log("resolve ", resolve)
//       return doWorkPromise("吃早餐", 3000, false)
//     }, (reject) => {
//       console.log("reject ", reject)
//     }
//   )
//   .catch((err) => {
//     console.error("catch ", err)
//   })
//   .then((resolve) => {
//       console.log("resolve ", resolve)
//       return doWorkPromise("寫功課", 2000, true)
//     }, (reject) => {
//       console.log("reject ", reject)
//     }
//   )
//   .catch((err) => {
//     console.error("catch ", err)
//   })
//   .then((resolve) => {
//       console.log("resolve ", resolve)
//     }, (reject) => {
//       console.log("reject ", reject)
//     }
//   )
//   .catch((err) =>{
//     console.error("catch ", err)
//   })

