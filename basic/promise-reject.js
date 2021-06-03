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
 *
 * 
 * Answer：
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
 * 三種作法在實現 Promise 的 resolve()、reject() callback 上都是可行，但差異如下：
 * 作法1. 當其中一個 then((onFulfilled)) 執行過程出現錯誤或 reject() callback 的時候，會進到 catch()，雖然可以正確接到錯誤，但接完就結束，無法達到每個 then() 的串接功能。
 * 作法2. 由於使用 then((onFulfilled), (onRejected))，因此該 Promise 執行過程中不論正確或錯誤皆能順利執行，但如於 then() 的執行過程中出現錯誤，則會進到最後 catch()，仍無法達到每個 then() 的串接功能。
 * 作法3. 每個 Promise 的 resolve() 會進到 then((onFulfilled))，reject() 或 then((onFulfilled)) 執行過程錯誤則會進到 catch()，並依序執行串接下去。
 * 作法4. 每個 Promise 的 resolve() 會進到 then((onFulfilled))，reject() 會進到 then((onRejected))，兩個 callback 如過程有錯皆會進到各自的 catch()，並依序執行串接下去。
 * 
 * B.
 * 以作法3.會是最好閱讀及維護。
 ******************************************************************/

 let doWorkPromise = function (job, timer, success) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let dt = new Date();
        if (success) {
          // 成功
          return resolve(`完成工作: ${job} at ${dt.toISOString()}`);
        }
        reject(`!!工作失敗: ${job} at ${dt.toISOString()}`);
      }, timer);
    });
  };
  
  // 刷完牙 > 吃早餐 > 寫功課
  // 作法 1
  doWorkPromise("刷牙", 2000, true)
    .then((result) => {
      // fulfilled 處理成功 resolve
      console.log(result);
      return doWorkPromise("吃早餐", 3000, false);
    })
    // 測試3
    // .catch((err) => {
    //   // 這裡多加一個 catch，捕捉這個 catch 之前的錯誤
    //   // 最後仍會 return 一個 promise 讓下一個 then 繼續發生
    //   // 但因為沒有真的 return 什麼資料，所以下一個 then 的 result 會是 undefined
    //   console.log("中間的 catch 攔截", err);
    // })
    .then((result) => {
      console.log("成功地吃早餐了嗎？", result);
      return doWorkPromise("寫功課", 5000, true);
    })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      // rejected 處理失敗 reject
      console.error("發生錯誤", err);
    })
    .finally(() => {
      console.log("我是 Finally");
    });
  
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
// let doWorkPromise = function(job, timer, success){
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             let dt = new Date()
//             if(success) resolve(`完成工作：${job} at ${dt.toISOString()}`)
//             else reject(`工作失敗：${job} at ${dt.toISOString()}`)
//         }, timer)
//     })
// }

// let dt = new Date()
// console.log(`開始工作：at ${dt.toISOString()}`)


// doWorkPromise("刷牙", 2000, true)
//     .then((result) => {
//         console.log(result)
//         return doWorkPromise("吃早餐", 3000, false)
//     })
//     .then((result) => {
//         console.log(result)
//     })
//     .catch((err) => {
//         console.error(err)
//     })


// doWorkPromise("刷牙", 2000, false)
//     .then((result) => {
//         console.log(result)
//     }, (result2) => {
//         console.log(result2)
//     })