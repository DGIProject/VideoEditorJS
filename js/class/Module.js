/**
 * Created by Guillaume on 03/06/2015.
 */

Module = function (name)
{
    this.name = name;
    this.description = "";
    this.version = 0;
    
};

Module.prototype.start = function()
{
    /*  Trigered when module loaded
        update UI if needed here !
     */
};

Module.prototype.remove = function()
{
    /*  on remove trigger event
        update if needed, interface
     */
};