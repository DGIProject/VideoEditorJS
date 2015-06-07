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
                modal.setModalTitle("testModal");
                modal.innerHTML = "Yoop";
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
            {id: 'contextMenu.testMenu.text', text : 'ClickAlert'}
        ]
    }
});