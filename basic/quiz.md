# (1) 請問下列程式執行後的結果為何？為什麼？

    console.log("start");

    (function () {
      console.log("IIFE");
      setTimeout(function () {
        console.log("Timeout");
      }, 1000);
    })();

    console.log("end");


    A:
    start
    IIFE
    end
    Timeout

 因為有設定timeout，所以1秒後才會執行到console.log("Timeout")<br>
 <br>
 
1. js 程式會依序由上而下將該 function push to stack 執行，執行完後隨即將其 pop
2. 待執行到 setTimeout 的時候，因其為 browser 的 API，因此會置於 web apis，隨即又 push to task queue，但如有 timer 狀況(ex. setTimeout)，則會待時間到達時才 push to task queue，因此本題會於 1 秒後 push to task queue
3. 待 js 程式都執行完畢後，代表 stack 為空，那麼 event loop 則會開始工作
4. event loop 判斷 stack 為空時，會依序將 task queue 之任務 push to stack 並執行，直到 task queue 為空為止


# (2) 請問下列程式執行的結果為何？為什麼？

    console.log("start");

    (function () {
        console.log("IIFE");
        setTimeout(function () {
            console.log("Timeout");
        }, 0);
    })();

    console.log("end");

    A:
    start
    IIFE
    end
    Timeout

雖然timeout設定為0秒後執行，但因為js為single thread的關係，執行方法為FIFO<br>
setTimeout此function會被排在最後在執行，而0秒會變成「盡早執行」之意




//(3) 請問下列程式執行的結果為何？為什麼？
/* 
 * A:
 * foo
 * bar
 * baz
 * 
 * () => {} 等同 function(){}
 * foo()內包含其他function
 * 所以執行到foo()後才會執行到其他function
 * 
*/
const bar = () => console.log("bar");

const baz = () => console.log("baz");

const foo = () => {
    console.log("foo");
    bar();
    baz();
};

foo();


//(4) 請問下列程式執行的結果為何？為什麼？
/* 
 * A:
 * foo
 * baz
 * bar
 * 
 * 此原因為(2)與(3)的結合
 * 執行foo()後才開始執行其他function，接者因為single-thread及FIFO的關係才會有此結果
 * 
*/
const bar = () => console.log("bar");

const baz = () => console.log("baz");

const foo = () => {
    console.log("foo");
    setTimeout(bar, 0);
    baz();
};

foo();
