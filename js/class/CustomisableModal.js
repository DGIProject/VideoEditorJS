/**
 * Created by Guillaume on 07/06/2015.
 */

CustomisableModal = function () {
    this.innerHTML = "";

};

CustomisableModal.prototype.setModalTitle = function (textId) {
    
};

CustomisableModal.prototype.show = function () {
    this.clearModal();
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
