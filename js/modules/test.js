/**
 * Created by Guillaume on 03/06/2015.
 */

ModuleController.add('test', {
    name: "test",
    description: "this a test module",
    version: 0.1,
    onStart: function (id) {
        this.id = id;
        console.log('Modules : Module started !');
        ContextMenu.add({
            onclick: function () {
                console.log("WORLING !");
                // Create a new custom modal

                var modal = new CustomisableModal();
                modal.body.add([
                    modal.uiElements.div('customModal.div.row',[{name : 'class', value : 'row'}],[
                            modal.uiElements.div('customModal.div.col-md-12', [{name : "class", value: "col-md-12"}],[
                                    modal.uiElements.span(this.name + '.span1.text', "Je fais des test", [{
                                        name: 'class',
                                        value: 'text-info'
                                    }]),
                                    modal.uiElements.br(),
                                    modal.uiElements.img(this.name + '.modalImg', [
                                        {name: 'src', value: 'http://amiemesmains.a.m.pic.centerblog.net/o/4fe39f68.jpg'},
                                        {name: 'style', value: 'width:300px;height:auto;'}
                                    ])]
                            )])
                ]);
                modal.footer.add(modal.uiElements.button('customModal.btn',[
                    {name :'type', value :"button"},{name : 'class' ,value :"btn btn-default"}, {name : 'data-dismiss', value :"modal"}
                ]));
                modal.show();

                console.log(this);
            },
            toShow: function () {

                return true
            }
        }, 'testMenu');


    },
    onRemove: function () {
        ContextMenu.remove('testMenu');
    },
    lang: {
        default: 'en',
        en: [
            {id: 'contextMenu.testMenu.text', text: 'ClickAlert'}
        ]
    }
});