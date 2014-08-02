document.onmousedown = function(e)
{
    if(currentProject.isStarted)
    {
        if(currentManageTextElement.isEnabled)
        {
            currentManageTextElement.mouseDown(e.clientX, e.clientY, e.button);
        }
        else
        {
            lastPosition.x = e.clientX;
            lastPosition.y = e.clientY;
        }
    }
};

document.onmouseup = function(e)
{
    if(currentProject.isStarted)
    {
        if(currentManageTextElement.isEnabled)
        {
            currentManageTextElement.mouseUp(e.button);
        }
    }
};

document.onmousemove = function(e)
{
    if(currentProject.isStarted)
    {
        if(currentManageTextElement.isEnabled)
        {
            currentManageTextElement.mouseMove(e.clientX, e.clientY);
        }
        else
        {
            if (canMove && !resizing) {
                event = e || window.event;

                console.log(divElementSelectedForMove)
                var elementsIdCurrentTrack = tabListTracks[divElementSelectedForMove.trackId].elementsId;
                console.log(elementsIdCurrentTrack)
                var posInTabListElements = elementsIdCurrentTrack.lastIndexOf(divElementSelectedForMove.elementListID)
                var elementIdFinded = elementsIdCurrentTrack[posInTabListElements]
                console.log(elementIdFinded, "Nous avons trouvé !!!!")
                var offsetWindow = $("#VideoView").offset().left
                if (posInTabListElements > 0)
                {

                    var beforElement = $("#trackElementId"+parseInt(posInTabListElements-1));
                    console.log(beforElement.offset().left, event.clientX)
                    var extremitBeforElementOffset = beforElement.offset().left + beforElement.width();
                    console.log("extremit = ", extremitBeforElementOffset)
                    var offsetElement = divElementSelectedForMove.Object.offsetLeft
                    var actualMargin = divElementSelectedForMove.Object.style.marginLeft.replace('px','');
                    var positionInEditAeraX = event.clientX - extremitBeforElementOffset - divElementSelectedForMove.Object.style.width.replace('px','')/2 - document.getElementById("VideoView").scrollLeft;
                    console.log("margin basique", actualMargin, offsetElement, positionInEditAeraX)

                }
                else
                {
                    var offsetElement = divElementSelectedForMove.Object.offsetLeft
                    var actualMargin = divElementSelectedForMove.Object.style.marginLeft.replace('px','');
                    var positionInEditAeraX = event.clientX - offsetWindow - divElementSelectedForMove.Object.style.width.replace('px','')/2;
                    console.log("margin basique", actualMargin, offsetElement, positionInEditAeraX)
                }
                if (actualMargin >= 0 || positionInEditAeraX >= 0)
                {
                    divElementSelectedForMove.Object.style.marginLeft = document.getElementById("VideoView").scrollLeft + positionInEditAeraX + "px";
                }

            }
        }
    }
};

document.onkeypress = function(e)
{
    if(currentProject.isStarted)
    {
        if(currentManageTextElement.isEnabled)
        {
            currentManageTextElement.keyPress(e.keyCode, e.charCode);
        }
        else
        {
            if (e.keyCode == 37) // left
            {
                document.getElementById('VideoView').scrollLeft = document.getElementById('VideoView').scrollLeft - 10
            }
            else if (e.keyCode == 39) // right
            {
                document.getElementById('VideoView').scrollLeft = document.getElementById('VideoView').scrollLeft + 10
            }
            console.log(e.keyCode, "keycode")
        }
    }
};