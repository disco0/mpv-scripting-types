// Type definitions for mp
// Project: mpv
// Definitions by: disco0 https://github.com/disco0

declare namespace mp {
    // TODO: Improve callback signature, replace where needed below if
    // this adequate (and not just more terse) replacement
    // type Callback = (args: any) => void;

    // Somewhat catch alls for now, definitions and places already used will be
    // modified
    type Id                 = number;
    type Table              = object;
    type DefaultValue       = any;
    type CommandReturnValue = any;
    type Miliseconds        = number
    type Option             = string | boolean | number;

    enum MessageLevel {
        debug,
        error,
        fatal,
        info,
        trace,
        verbose,
        warn
    }

    interface FileInfo {
        mode:    number,
        // protection bits (on Windows, always 755 (octal) for directories and 644 (octal) for files)
        size:    number,
        // size in bytes
        atime:   number,
        // time of last access
        mtime:   number,
        // time of last modification
        ctime:   number,
        // time of last metadata change (Linux) / time of creation (Windows)
        is_file: boolean,
        // Whether path is a regular file (boolean)
        is_dir:  boolean
        // Whether path is a directory (boolean)
    }

    function add_timeout(fn: (args: any) => void, ms: Miliseconds): Id;

                                    //? Double check this later
    function command(string: string): boolean;

    function commandv(...arg: string[]);

    function command_native(table: object, def?: DefaultValue);

    // Notes: id is true-thy on success, fn is called always a-sync, error is empty string on success.
    function command_native_async(table: Table, fn: (...args: any[]) => void) : Id;

    function abort_async_command(id: Id): CommandReturnValue;

    function get_property(name: string, def?: DefaultValue): Option | DefaultValue;

    function get_property_osd(name: string , def?: DefaultValue): string | DefaultValue;

    function get_property_bool(name: string, def?: DefaultValue): boolean | DefaultValue;

    function get_property_number(name: string, def?: DefaultValue): number | DefaultValue;

    function get_property_native(name: string): Option;
    function get_property_native(name: string, def: DefaultValue): Option | DefaultValue;

    function set_property(name: string, value: Option);

    function set_property_bool(name: string, value: boolean);

    function set_property_number(name: string, value: number);

    function set_property_native(name: string, value: Option);

    function get_time(): number;

    // @Notes add_(forced_)key_binding
    // Including until type definition is better fully understood
      /*
          Register callback to be run on a key binding. The binding will be
        mapped to the given key, which is a string describing the physical
        key. This uses the same key names as in input.conf, and also allows
        combinations (e.g. ctrl+a). If the key is empty or nil, no physical
        key is registered, but the user still can create own bindings (see
        below).

        After calling this function, key presses will cause the function fn
        to be called (unless the user remapped the key with another binding).

        The name argument should be a short symbolic string. It allows the
        user to remap the key binding via input.conf using the script-message
        command, and the name of the key binding (see below for an example).
        The name should be unique across other bindings in the same script -
        if not, the previous binding with the same name will be overwritten.
        You can omit the name, in which case a random name is generated
        internally.

        The last argument is used for optional flags. This is a table, which
        can have the following entries:

        repeatable If set to true, enables key repeat for this specific
        binding. complex If set to true, then fn is called on both key up and
        down events (as well as key repeat, if enabled), with the first
        argument being a table. This table has an event entry, which is set
        to one of the strings down, repeat, up or press (the latter if key
        up/down can't be tracked). It further has an is_mouse entry, which
        tells whether the event was caused by a mouse button. Internally, key
        bindings are dispatched via the script-message-to or script-binding
        input commands and mp.register_script_message.

        Trying to map multiple commands to a key will essentially prefer a
        random binding, while the other bindings are not called. It is
        guaranteed that user defined bindings in the central input.conf are
        preferred over bindings added with this function (but see
        mp.add_forced_key_binding).

        Example:

        function something_handler() print("the key was pressed") end
            mp.add_key_binding("x", "something", something_handler) This will
            print the message the key was pressed when x was pressed.

        The user can remap these key bindings. Then the user has to put the
        following into their input.conf to remap the command to the y key:

        y script-binding something This will print the message when the key y
        is pressed. (x will still work, unless the user remaps it.)

        You can also explicitly send a message to a named script only. Assume
        the above script was using the filename fooscript.lua:

        y script-binding fooscript/something mp.add_forced_key_binding(...)
        This works almost the same as mp.add_key_binding, but registers the
        key binding in a way that will overwrite the user's custom bindings
        in their input.conf. (mp.add_key_binding overwrites default key
        bindings only, but not those by the user's input.conf.)
       */
    // @EndNotes mp.add_(forced_)key_binding

    enum KeybindingFlag {
        repeatable,
        complex
    }

    enum mpvEvent {

        // Happens right before a new file is loaded. When you receive this, the
        // player is loading the file (or possibly already done with it).
        startfile = "start-file",

        // Happens after a file was unloaded. Typically, the player will load the
        // next file right away, or quit if this was the last file.
        endfile = "end-file",

        // TODO: Add these into Enum if correct place
        // // The event has the reason field, which takes one of these values:
        //     eof = "eof",
        //     // The file has ended. This can (but doesn't have to) include incomplete files or broken network connections under circumstances.
        //     stop = "stop",
        //     // Playback was ended by a command.
        //     quit = "quit",
        //     // Playback was ended by sending the quit command.
        //     error = "error",
        //     // An error happened. In this case, an error field is present with the error string.
        //     redirect = "redirect",
        //     // Happens with playlists and similar. Details see MPV_END_FILE_REASON_REDIRECT in the C API.
        //     unknown = "unknown",
        //     // Unknown. Normally doesn't happen, unless the Lua API is out of sync with the C API. (Likewise, it could happen that your script gets reason strings that did not exist yet at the time your script was written.)

        // Happens after a file was loaded and begins playback.
        FileLoaded = "file-loaded",

        // Happens on seeking. (This might include cases when the player seeks
        // internally, even without user interaction. This includes e.g. segment changes when playing ordered chapters Matroska files.)
        Seek = "seek",

        // Start of playback after seek or after file was loaded.
        PlaybackRestart = "playback-restart",

        // Idle mode is entered. This happens when playback ended, and the player
        // was started with --idle or --force-window. This mode is implicitly ended when the start-file or shutdown events happen.
        Idle = "idle",

        // Called after a video frame was displayed. This is a hack, and you should
        // avoid using it. Use timers instead and maybe watch pausing/unpausing events to avoid wasting CPU when the player is paused.
        Tick = "tick",

        // Sent when the player quits, and the script should terminate. Normally
        // handled automatically. See Details on the script initialization and lifecycle.
        Shutdown = "shutdown",

        // Receives messages enabled with mp.enable_messages. The message data is
        // contained in the table passed as first parameter to the event handler.
        LogMessage = "log-message",

        // The table contains, in addition to the default event fields, the following fields:
        // // The module prefix, identifies the sender of the message. This is what the
        // // terminal player puts in front of the message text when using the --v
        // // option, and is also what is used for --msg-level.
        // Prefix = "prefix",

        // // The log level as string. See msg.log for possible log level names. Note
        // // that later versions of mpv might add new levels or remove (undocumented) existing ones.
        // Level = "level",

        // // The log message. The text will end with a newline character. Sometimes it
        // // can contain multiple lines. Keep in mind that these messages are meant to
        // // be hints for humans. You should not parse them, and prefix/level/text of
        // // messages might change any time.
        // Text = "text",

        // Undocumented (not useful for Lua scripts).
        GetPropertyReply = "get-property-reply",

        // Undocumented (not useful for Lua scripts).
        SetPropertyReply = "set-property-reply",

        // Undocumented (not useful for Lua scripts).
        CommandReply = "command-reply",

        // Undocumented (used internally).
        ClientMessage = "client-message",

        // Happens on video output or filter reconfig.
        VideoReconfig = "video-reconfig",

        // Happens on audio output or filter reconfig.
        AudioReconfig = "audio-reconfig"
    }

    function add_key_binding( key:  string,
                              name: string,
                              fn?:  (args: any) => void,
                              flags?: KeybindingFlag[]
                            );
    function add_key_binding( key: string,
                              fn: (args: any) => void,
                              flags?: KeybindingFlag[]
                            );

    function add_forced_key_binding( key:  string,
                                     name: string,
                                     fn?:  (args: any) => void,
                                     flags?: KeybindingFlag[]
                                   );
    function add_forced_key_binding( key: string,
                                     fn:  (args: any) => void,
                                     flags?: KeybindingFlag[]
                                   );

    function remove_key_binding(name: string);

    function register_event(name: string, fn:(args: any) => void);

    function unregister_event(fn: (args: any) => void);

    function observe_property(name: string, type: Option, fn: (args: any) => void);

    function unobserve_property(fn: (args: any) => void);

    function get_opt(name: string);

    function get_script_name(): string;

    function osd_message(text: string, duration?: Miliseconds);

    function get_wakeup_pipe(): Id;

    function register_idle(fn: (args: any) => void);

    function unregister_idle(fn: (args: any) => void);

    function enable_messages(level: MessageLevel);

    function register_script_message(name: string, fn: (args: any) => void);

    function unregister_script_message(name: string);

    namespace msg {

        function log(level: MessageLevel, ...msg: string[]);

        function fatal(...msg: string[]);

        function error(...msg: string[]);

        function warn(...msg: string[]);

        function info(...msg: string[]);

        function verbose(...msg: string[]);

        function debug(...msg: string[]);

        function trace(...msg: string[]);
    }

    namespace utils {

        // Again, just tryna get it all down to fix after
        type Path         = string;
        type RelativePath = Path;
        type FileName     = RelativePath | string;

        // interface ProcessTable {
        //     name          : string;
        //     cancellable   : boolean;
        //     max_size      : number;
        //     capture_stdout: boolean;
        // }

        function getcwd(): Path;

        function readdir(path: Path, filter?: string): Path[];

        function file_info(path: Path): FileInfo | Error;

        function split_path(path: Path): [Path, Path] | Path;

        function join_path(p1: Path, p2: RelativePath): Path;

        function subprocess(t: Table);

        function subprocess_detached(t: Table);

        function getpid(): Id;

        // Like print but also expands objects and arrays recursively.
        // Returns the value of the host environment variable name, or undefined
        // if the variable is not defined.
        function getenv(name): string;

        // Expands (mpv) meta paths like ~/x, ~~/y, ~~desktop/z etc. read_file,
        // write_file and require already use this internaly.
        function get_user_path(path: Path): Path;

        // Returns the content of file fname as string. If max is provided and
        // not negative, limit the read to max bytes.
        function read_file(fname: Path, max?: number): string;

        // (Over)write file fname with text content str. fname must be prefixed
        // with file:// as simple protection against accidental arguments switch,
        // e.g. mp.utils.write_file("file://~/abc.txt", "hello world").
        // Note: read_file and write_file throw on errors, allow text content only.
        function write_file(fname: Path, str: string);

        // Compiles the JS code content_str as file name fname (without loading anything from the filesystem), and returns it as a function. Very similar to a Function constructor, but shows at stack traces as fname.
        function compile_js(fname, content_str);
    }


    function add_hook(type: mpvEvent, priority: number, fn: (args: any) => void);


    // Same as mp.get_time() but in ms instead of seconds.
    function get_time_ms(): Miliseconds;

    // Returns the file name of the current script.
    function get_script_file(): string;
}

