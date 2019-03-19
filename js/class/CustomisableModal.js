/**
 * Created by Guillaume on 07/06/2015.
 */

CustomisableModal = function () {
    this.innerHTML = "";

    this.setUpBody();

    this.setUpFooter();
    
    this.setUpHeader();

    this.setUpUiElem();
};

CustomisableModal.prototype.setUpUiElem = function(){
    this.uiElements = {
        span : function (id, content, attr){
            var span = document.createElement("span");
            span.id = id;

            if (content.constructor === Array)
            {
                for (i=0;i<content.length;i++)
                {
                    span.appendChild(content[i]);
                }
            }
            else
            {
                span.innerHTML = content;
            }


            if (attr != null)
            {
                for (var i=0;i<attr.length;i++)
                {
                    span.setAttribute(attr[i].name, attr[i].value)
                }
            }
            return span;
        },
        button : function (id, attr, text) {
            var button = document.createElement("button");
            button.id = id;
            if (attr != null)
            {
                for (var i=0;i<attr.length;i++)
                {
                    button.setAttribute(attr[i].name, attr[i].value)
                }
            }
            button.innerHTML = text;
            return button;
        },
        img : function (id, attr) {
            var img = document.createElement("img");
            img.id = id;
            if (attr != null)
            {
                for (var i=0;i<attr.length;i++)
                {
                    img.setAttribute(attr[i].name, attr[i].value)
                }
            }
            return img;
        },
        div : function (id, attr, content) {
            var div = document.createElement("div");
            div.id = id;
            if (attr != null)
            {
                for (var i=0;i<attr.length;i++)
                {
                    div.setAttribute(attr[i].name, attr[i].value)
                }
            }

            if (content != null)
            {
                if (content.constructor === Array)
                {
                    for (i=0;i<content.length;i++)
                    {
                        div.appendChild(content[i]);
                    }
                }
                else
                {
                    div.innerHTML = content;
                }
            }

            return div;
        },
        ul : function (id, attr, lst) {
            var ul = document.createElement("ul");
            ul.id = id;
            if (attr != null)
            {
                for (var i=0;i<attr.length;i++)
                {
                    ul.setAttribute(attr[i].name, attr[i].value)
                }
            }

            if (lst != null)
            {
                for (var i=0;i<lst.length;i++)
                {
                    ul.appendChild(lst[i])
                }
            }

            return ul;
        },
        li : function (id, attr, content) {
            var li = document.createElement("li");
            li.id = id;
            if (attr != null)
            {
                for (var i=0;i<attr.length;i++)
                {
                    li.setAttribute(attr[i].name, attr[i].value)
                }
            }

            if (content != null)
            {
                if (content.constructor === Array)
                {
                    for (i=0;i<content.length;i++)
                    {
                        li.appendChild(content[i]);
                    }
                }
                else
                {
                    li.innerHTML = content;
                }
            }

            return li;
        },
        br : function(){
            return document.createElement('br');
        }
    }
}

CustomisableModal.prototype.setUpFooter = function(){
    this.footer = {
        content: document.createElement('div'),
        add : function(nodes){
            if (nodes.constructor === Array)
            {
                for (var i=0; i<nodes.length; i++)
                {
                    this.content.appendChild(nodes[i])
                }
            }
            else
            {
                this.content.appendChild(nodes);
            }
            return this;
        },
        getContent : function(){
            return this.content
        }
    };
};

CustomisableModal.prototype.setUpBody = function(){
    this.body = {
        content: document.createElement('div'),
        add : function(nodes){
            if (nodes.constructor === Array)
            {
                for (var i=0; i<nodes.length; i++)
                {
                    this.content.appendChild(nodes[i])
                }
            }
            else
            {
                this.content.appendChild(nodes);
            }
            return this;
        },
        getContent : function(){
            return this.content
        }
    };
}

CustomisableModal.prototype.setUpHeader = function(){
    this.header = {
        content : null,
        setTitle : function (title, titleId) {
            var titleNode = document.createElement('span');
            titleNode.id = titleId;
            titleNode.innerHTML = title;
            //this.content.appendChild(titleNode);
            this.content = titleNode;
        },
        getContent : function () {
            return this.content;
        },
        closebtn : true

    };
}

CustomisableModal.prototype.show = function () {
    this.clearModal();
    document.querySelector("#customModal .modal-title").appendChild(this.header.getContent());
    document.querySelector("#customModal .modal-body").appendChild(this.body.getContent());
    document.querySelector("#customModal .modal-footer").appendChild(this.footer.getContent());
    $("#customModal").modal('show');
};

CustomisableModal.prototype.hide = function () {

    $("#customModal").modal('hide');
};

CustomisableModal.prototype.clearModal = function () {
    document.querySelector("#customModal .modal-body").innerHTML = "";
    document.querySelector("#customModal .modal-footer").innerHTML = "";
    document.querySelector("#customModal .modal-title").innerHTML = "";
};
