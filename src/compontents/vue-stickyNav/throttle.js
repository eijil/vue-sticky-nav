export function throttle(func, wait = 100) {

    var ctx, args, rtn, timeoutID; // caching
    var last = 0;

    return function throttled() {
        ctx = this;
        args = arguments;
        var delta = new Date() - last;
        if (!timeoutID)
            if (delta >= wait) call();
            else timeoutID = setTimeout(call, wait - delta);
        return rtn;
    };

    function call() {
        timeoutID = 0;
        last = +new Date();
        rtn = func.apply(ctx, args);
        ctx = null;
        args = null;
    }
}