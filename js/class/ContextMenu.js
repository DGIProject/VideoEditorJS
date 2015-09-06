/**
 * Created by Guillaume on 07/06/2015.
 */

Menu = function()
{
    this.menu = [];
};

Menu.prototype.add = function(object, uniqueId){
    this.menu.push({id: uniqueId, obj: object});
};

Menu.prototype.remove = function (uniqueId) {
    this.menu.remove(rowById(uniqueId, this.menu));
};

Menu.prototype.getMenu = function(element, trackId){

    var menu = document.getElementById('contextMenu');

    menu.innerHTML = '';

    for (var i=0 ; i < this.menu.length; i++)
    {
        //htmlContent += '<li id="contextMenu.'+this.menu[i].id +'.li"><a id="contextMenu.'+this.menu[i].id +'.a" tabindex="-1" href="#"><span id="contextMenu.'+this.menu[i].id +'.text">'+this.getTranslation(this.menu[i].id)+'</span></a></li>'

        if (this.menu[i].obj.toShow(element, trackId))
        {
            this.menu[i].obj.element = element;
            this.menu[i].obj.trackId = trackId;
            var li = document.createElement('li');
            li.setAttribute('id','contextMenu.'+this.menu[i].id+'.li');

            var a = document.createElement('a');
            a.setAttribute('id','contextMenu.'+this.menu[i].id +'.a' );
            a.setAttribute('href', '#');
            a.setAttribute('tabindex', '-1');
            var itemMenu = this.menu[i];

            a.setAttribute('onclick', "ContextMenu.menu["+i+"].obj.onclick()");

            var span = document.createElement('span');
            span.setAttribute('id','contextMenu.'+this.menu[i].id+'.text');
            console.log(span, span.id);

            span.innerHTML = this.getTranslation('contextMenu.'+this.menu[i].id+'.text');

            a.appendChild(span);
            li.appendChild(a);
            menu.appendChild(li);
        }
    }

};

Menu.prototype.getTranslation = function (id) {
    console.log(id);
    var rowId = rowById(id, tabTranslations.translations);
    if (rowId != -1)
    {
        return tabTranslations.translations[rowId].text;
    }
    else
    {
        return false
    }
};