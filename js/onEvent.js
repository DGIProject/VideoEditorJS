document.onmousedown = function(e)
{
    if(currentProject)
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
    if(currentProject)
    {
        if(currentManageTextElement.isEnabled)
        {
            currentManageTextElement.mouseUp(e.button);
        }

        deselectFiles();
    }
};

document.onmousemove = function(e)
{
    if(currentProject)
    {
        if(currentManageTextElement.isEnabled)
        {
            currentManageTextElement.mouseMove(e.clientX, e.clientY);
        }
    }
};

document.onkeypress = function(e)
{
    if(currentProject)
    {
        if(currentManageTextElement.isEnabled)
        {
            currentManageTextElement.keyPress(e.keyCode, e.charCode);
        }
    }
};
