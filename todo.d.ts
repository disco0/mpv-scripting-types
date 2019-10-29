
//@TODO: Move somewhere
    // Additional utilities
    function last_error(): string;
    // If used after an API call which updates last error, returns an empty string if the API call succeeded, or a non-empty error reason string otherwise.
    Error.stack (string)
    // When using try { ... } catch(e) { ... }, then e.stack is the stack trace of the error - if it was created using the Error(...) constructor.
    print (global)
    // A convenient alias to mp.msg.info.
    dump (global)
    function options.read_options(obj: object, identifier: Path | string);

    // Timers (global)
    // The standard HTML/node.js timers are available:
    function setTimeout(fn [,duration [,arg1 [,arg2...]]]): Id;

    function setTimeout(code_string [,duration]); Id;

    function clearTimeout(id);

    function setInterval(fn [,duration [,arg1 [,arg2...]]]);

    function setInterval(code_string [,duration]);

    function clearInterval(id): void;

    // Make the script exit at the end of the current event loop iteration. Note: please remove added key bindings before calling exit().;
    function exit()
