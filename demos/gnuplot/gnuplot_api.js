// This is a minimal interface to the gnuplot worker. More sophisticated include virtual file-system lists and a reset function.

var Gnuplot = function(js_filename) {
        this.worker = new Worker(js_filename);
        this.output = [];
        this.error = [];
        this.isRunning = false;
        
        // These two should be overwritten by application.
        this.onOutput = function(text){console.log("Gnuplot output: " + text)};
        this.onError = function(text){console.log("Gnuplot error: " + text)};

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
