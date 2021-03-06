![image](https://github.com/ycchien313/nodejs-mfee16/blob/master/image/javascript%20step.png)

# (1) 請問下列程式執行後的結果為何？為什麼？
```
console.log("start");

    (function () {
      console.log("IIFE");
      setTimeout(function () {
        console.log("Timeout");
      }, 1000);
    })();

    console.log("end");

s
    Answer:
    start
    IIFE
    end
    Timeout
 ```
1. js 程式會依序由上而下將該 function push to stack 執行，執行完後隨即將其 pop
2. 待執行到 setTimeout() 的時候，因其為 browser 的 API，因此會置於 web apis，隨即又 push to task queue，但如有 timer 狀況(ex. setTimeout())，則會待時間到達時才 push to task queue，因此本題會於 1 秒後 push to task queue
3. 待 js 程式都執行完畢後，代表 stack 為空，那麼 event loop 則會開始工作
4. event loop 判斷 stack 為空時，會依序將 task queue 之任務 push to stack 並執行，直到 task queue 為空為止
<br>

# (2) 請問下列程式執行的結果為何？為什麼？

    console.log("start");

    (function () {
        console.log("IIFE");
        setTimeout(function () {
            console.log("Timeout");
        }, 0);
    })();

    console.log("end");


    Answer:
    start
    IIFE
    end
    Timeout

答案同 (1)

1. js 程式會依序由上而下將該 function push to stack 執行，執行完後隨即將其 pop
2. 待執行到 setTimeout() 的時候，因其為 browser 的 API，因此會置於 web apis，隨即又 push to task queue，但如有 timer 狀況(ex. setTimeout())，則會待時間到達時才 push to task queue，因此本題會於 0 秒後 push to task queue
3. 待 js 程式都執行完畢後，代表 stack 為空，那麼 event loop 則會開始工作
4. event loop 判斷 stack 為空時，會依序將 task queue 之任務 push to stack 並執行，直到 task queue 為空為止
<br>


# (3) 請問下列程式執行的結果為何？為什麼？

    const bar = () => console.log("bar");

    const baz = () => console.log("baz");

    const foo = () => {
        console.log("foo");
        bar();
        baz();
    };

    foo();


    Answer:
    foo
    bar
    baz

1. js 程式會依序由上而下將該 function push to stack 執行，執行完後隨即將其 pop
2. () => {} 等同 function(){}，因此 const bar、const baz、const foo 僅為宣告常數
3. foo() 則開始動作，並依序將 function 內之 console.log() push to stack 執行印出之行為
<br>


# (4) 請問下列程式執行的結果為何？為什麼？

    const bar = () => console.log("bar");

    const baz = () => console.log("baz");

    const foo = () => {
        console.log("foo");
        setTimeout(bar, 0);
        baz();
    };

    foo();


    Answer:
    foo
    baz
    bar

答案為 (2)、(3) 之結合

1. js 程式會依序由上而下將該 function push to stack 執行，執行完後隨即將其 pop
2. () => {} 等同 function(){}，而 const bar、const baz、const foo 僅為宣告常數
3. foo() 則開始動作，先將 console.log("foo") push to stack 執行，執行完隨即 pop
4. 待執行到 setTimeout() 的時候，因其為 browser 的 API，因此會置於 web apis，隨即又 push to task queue，但如有 timer 狀況(ex. setTimeout())，則會待時間到達時才 push to task queue，因此本題會於 0 秒後將 bar() push to task queue
5. 待 js 程式都執行完畢後，代表 stack 為空，那麼 event loop 則會開始工作
6. event loop 判斷 stack 為空時，會依序將 task queue 之任務 push to stack 並執行，直到 task queue 為空為止

