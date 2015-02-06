/**
 * Created by Guillaume on 03/02/2015.
 */

importScripts('../../demos/ffmpegJs/build/ffmpeg-all-codecs.js');

var now = Date.now;

function print(text) {
    postMessage({
        'type' : 'stdout',
        'text' : text
    });
}

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

onmessage = function(event) {

    var message = event.data;
    console.log("argument are ", message.argv)
    console.log("Paresed argv are", parseArguments(message.argv))
    if (message.command === "start") {


        var Module = {
            print: print,
            printErr: print,
            files: message.files || [],
            arguments: parseArguments(message.argv) || [],
            TOTAL_MEMORY: 268435456
            // Can play around with this option - must be a power of 2
            // TOTAL_MEMORY: 268435456
        };

        postMessage({
            'type' : 'start',
            'data' : Module.arguments.join(" ")
        });

        postMessage({
            'type' : 'stdout',
            'text' : 'Received command: ' +
            Module.arguments.join(" ") +
            ((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")
        });

        var time = now();
        var result = ffmpeg_run(Module);

        var totalTime = now() - time;
      /*  postMessage({
            'type' : 'stdout',
            'text' : 'Finished processing (took ' + totalTime + 'ms)'
        });*/

        postMessage({
            'type' : 'stop',
            'data' : result,
            'time' : totalTime
        });
    }
};

postMessage({
    'type' : 'ready'
});
