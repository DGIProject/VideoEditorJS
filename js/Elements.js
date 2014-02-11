/**
 * Created by Guillaume on 11/02/14.
 */

elementProprieties = {
    id: null,
    name: null,
    lenth: 0,
    position : {
        x:0,
        y:0
    }


}

Elements = function(id, name, lenth)
{
    this.id = id
    this.name = name
    this.lenth = lenth
    this.x = 0;
    this.y = 0;
    this.pos = function ()
    {


    }
    this.setPos = function(x,y)
    {
    this.x = x;
    this.y = y;
    }
}