/**
 * Created by Guillaume on 19/04/2015.
 */

canvas = document.getElementById('c');
canvas.onmousemove = function (e){
    clearCanvas();
    drawTime();
    //console.log(e);
    var rect = canvas.getBoundingClientRect();
    canvas = document.getElementById('c');
    ctx = canvas.getContext('2d');
    var x = e.clientX - rect.left, y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x,canvas.height/2);
    ctx.lineTo(x,canvas.height);
    ctx.closePath();
    ctx.stroke();



    var text = '00:00:12';
    ctx.font = "10pt Verdana";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    var textPxLength = ctx.measureText(text);

    var posX = (x<textPxLength.width/2)? textPxLength.width/2 : ( x>(canvas.width-(textPxLength.width)/2))? canvas.width-(textPxLength.width)/2 : x ;

    //(canvas.width-textPxLength.width)

    ctx.fillStyle = '#eeefff';
    ctx.fillRect(posX-(textPxLength.width/2),2,textPxLength.width+2, 12);
    //console.log(textPxLength);
    ctx.fillStyle = "#000000";
    ctx.fillText(text,posX,3);


}


function drawTime()
{
    canvas = document.getElementById('c');
    ctx = canvas.getContext('2d');
    var text = '00:00:00';
    ctx.font = "10pt Verdana";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    var textPxLength = ctx.measureText(text);
    //console.log(textPxLength);
    ctx.fillStyle = "#000000";
    ctx.fillText(text,0,3);

    text = '00:40:00';
    ctx.font = "10pt Verdana";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    textPxLength = ctx.measureText(text);
    //console.log(textPxLength);
    ctx.fillStyle = "#000000";
    ctx.fillText(text,(canvas.width-textPxLength.width),3);

}

function clearCanvas(){
    canvas = document.getElementById('c');
    ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,canvas.width, canvas.height);
}

window.onload = drawTime();