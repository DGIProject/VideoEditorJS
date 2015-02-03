/**
 * Created by Guillaume on 03/02/2015.
 */

importScripts('../../ffmpegJs/build/ffmpeg-all-codecs.js');

var now = Date.now;

function print(text) {
    postMessage({
        'type' : 'stdout',
        'text' : text
    });
}

onmessage = function(event) {

    var message = event.data;

    if (message.command === "start") {

        var Module = {
            print: print,
            printErr: print,
            files: message.files || [],
            arguments: message.argv || [],
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
