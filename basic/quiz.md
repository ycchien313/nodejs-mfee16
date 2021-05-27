# (1) 請問下列程式執行後的結果為何？為什麼？
=========================================

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

 因為有設定timeout，所以1秒後才會執行到console.log("Timeout")



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

雖然timeout設定為0秒後執行，但因為js為single thread的關係，執行方法為FIFO
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
