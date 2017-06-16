
const setTimeoutNative = window.setTimeout;
const setIntervalNative = window.setInterval;
const clearTimeOutNative = window.clearTimeout;
const clearIntervalNative = window.clearInterval;

let Reactivity ={
    setTimeOut(fn,time){
        setTimeoutNative(()=>{
            fn();
            RF.digest();
        },time);
    },
    setInterval(fn,time){
        setIntervalNative(()=>{
            fn();
            RF.digest();
        },time);
    },
    clearTimeOut(tid){
        clearTimeOutNative(tid);
    },
    clearInterval(tid){
        clearIntervalNative(tid);
    }
};