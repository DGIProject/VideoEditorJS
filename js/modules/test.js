/**
 * Created by Guillaume on 03/06/2015.
 */

ModuleController.add('test', {
    name: "test",
    description: "this a test module",
    version: 0.1,
    onStart: function (id) {
        this.id = id;
        console.log('Modules : Module started !')
        ContextMenu.add({
            onclick: function (element, trackId) {
                alert('yop !');
            },
            toShow: function () {

                return true
            }
        }, 'testMenu');
    },
    onRemove: function () {

    },
    lang: {
        default: 'en',
        en: [
            {id: 'contextMenu.testMenu.text', text : 'ClickAlert'}
        ]
    }
});