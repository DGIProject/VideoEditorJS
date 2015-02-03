/**
 * Created by Guillaume on 03/02/2015.
 */

onmessage = function(event) {
    console.log("pb ?",event.data);
    var message = event.data;

    var now = Date.now();
    if (message.command == "start")
    {
        postMessage({
            type : "stdout",
            text : "Available programs are :"
        });

        for(var key in message.status)
        {
            postMessage({
                type : "out",
                text : "- "+key
            });
        }
    }
    postMessage({
        type : "out",
        text : "----------"
    });
    postMessage({
        type : "stop",
        time : Date.now() - now
    });

};

postMessage({
    type : "ready"
});
