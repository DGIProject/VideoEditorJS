/**
 * Created by Guillaume on 04/02/2015.
 */

function parseArguments(text) {
    // text = text.replace(/\s+/g, ' ');
    var args = [];
    // Allow double quotes to not split args.
    text.split('"').forEach(function(t, i) {
        t = t.trim();
        if ((i % 2) === 1) {
            args.push(t);
        } else {
            args = args.concat(t.split(" "));
        }
    });
    return args;
}
function ArrayBufferToStr(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}
onmessage = function(event) {
    console.log("gnuplot :",event.data);
    var message = event.data;
    var that = this;

    var now = Date.now();
    if (message.command == "start")
    {
        if (message.files.length != 0)
        {
            var scriptFileIndex = -1;
            var parsedArgs = parseArguments(message.argv);
            console.log("args found are ", parsedArgs);
            for (i=0; i<message.files.length; i++)
            {
                if (message.files[i].name == parsedArgs[0])
                {
                    scriptFileIndex = i;
                    break;
                }
            }
            if (scriptFileIndex == -1)
            {
                postMessage({
                    type : "stdout",
                    text : "Specified file not found !"
                });
                postMessage({
                    type : "stop",
                    time : Date.now() - now
                });
            }
            gnuplot = new Gnuplot('../../demos/gnuplot/gnuplot.js');

            gnuplot.onOutput = function(text) {
                console.info(text);
            };
            gnuplot.onError = function(text) {
                console.error(text);
            };

            var mainScript = ArrayBufferToStr(message.files[scriptFileIndex].data);
            for (i=0; i<message.files.length;i++)
            {
                if (i != scriptFileIndex)
                {
                    gnuplot.putFile(message.files[i].name, message.files[i].data);
                }
            }

            gnuplot.run(mainScript, function(e) {
                //gnuplot.onOutput('Execution took ' + (Date.now() - start) / 1000 + 's.');
                gnuplot.getFile('out.svg', function(e) {
                    if (!e.content) {
                        gnuplot.onError("Output file out.svg not found!");

                        that.postMessage({
                            type : "stop",
                            time : 0
                        });
                    }
                    var ab = new Uint8Array(e.content);
                    var blob = new Blob([ab], {"type": "image\/svg+xml"});
                    postMessage({
                        type : "stdout",
                        text : "url is "
                    });
                    postMessage({
                        type : "stdout",
                        text : "----------"
                    });
                    postMessage({
                        type : "stop",
                        time : Date.now() - now,
                        data : blob
                    });
                });
            });
        }
        else
        {
            postMessage({
                type : "stdout",
                text : "No file found"
            });
            postMessage({
                type : "stdout",
                text : "Usage : gnuplot mainScript data01 data02 data03"
            });
        }
    }
};

postMessage({
    type : "ready"
});

var Gnuplot = function(js_filename) {
    console.log("GNUPLOT INIT !");
    this.worker = new Worker(js_filename);
    this.output = [];
    this.error = [];
    this.isRunning = false;

    // These two should be overwritten by application.
    this.onOutput = function(text){console.info("Gnuplot output: " + text)};
    this.onError = function(text){console.error("Gnuplot error: " + text)};

    this.transaction = 1;
    this.callbacks = [];
    this.postCommand = function(cmd_block, callback) {
        var id = this.transaction; // fresh id
        cmd_block.transaction = id; // give data object a tag
        this.callbacks[id] = callback;
        this.worker.postMessage(cmd_block);
        this.transaction++;
    };


    var that = this;
    this.worker.addEventListener('message', function(e) {
        // console.log('gnuplot: ', e.data); //enable for debug
        var data = e.data;
        if (data.transaction < 0) {
            if (data.transaction == -1) {
                that.output.push(data.content);
                that.onOutput(data.content);
            };
            if (data.transaction == -2) {
                that.error.push(data.content);
                that.onError(data.content);
            };
            return;
        }
        if (data.content == 'FINISH')
            that.isRunning = false;
        if (data.transaction && that.callbacks[data.transaction]) {
            that.callbacks[data.transaction](data);
            delete that.callbacks[data.transaction];
        }
    }, false);

    this.worker.postMessage({});    // supposed to do this to start the worker?
};
Gnuplot.prototype.putFile = function(name_, contents) {
    var data = {
        name: name_,
        content: contents,
        cmd: 'putFile'
    };
    this.postCommand(data, null);
};
// to read output
Gnuplot.prototype.getFile = function(name_, callback) {
    var data = {
        name: name_,
        cmd: 'getFile'
    };
    this.postCommand(data, callback);
};
Gnuplot.prototype.run = function(script, onFinish) {
    if (this.isRunning) return false;
    this.putFile('foo', script);
    var data = {
        content: ['foo'],
        cmd: 'run'
    };
    this.isRunning = true;
    this.postCommand(data, onFinish);
    return true;
};
