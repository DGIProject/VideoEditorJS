/**
 * Created by Guillaume on 03/06/2015.
 */

var MODULE_TYPE = {
    EFFECT: 0,
    TRANSITION: 1
};

ModuleControl = function ()
{
    this.modules = []
};

ModuleControl.prototype.add = function(moduleName, moduleType, module)
{
    var id = (this.modules.length == 0)? 1 :this.modules[this.modules.length-1].id + 1;
    this.modules.push({id : id ,"name" : moduleName, type: moduleType, "module" : module});
    console.log('Starting module', moduleName);

    var translations  = tabTranslations.translations;
    var translationsToAdd = [];

    this.modules[this.modules.length-1].module.isDisabled = false;

    if (this.modules[this.modules.length-1].module.lang.hasOwnProperty(tabTranslations.lang))
    {
        translationsToAdd  = this.modules[this.modules.length-1].module.lang[tabTranslations.lang];
        console.log("concat", translationsToAdd);
    }
    else
    {
        translationsToAdd = this.modules[this.modules.length-1].module.lang[this.modules[this.modules.length-1].module.lang.default];
        console.log("concat default", translationsToAdd );
    }
    tabTranslations.translations = translations.concat(translationsToAdd);

    //this.modules[this.modules.length-1].module.onStart(id);

};

ModuleControl.prototype.remove = function(moduleId)
{
    var row = rowById(moduleId, this.modules);
    this.modules[row].module.onRemove();
    this.modules.remove(row)
};

ModuleControl.prototype.disable = function (moduleId) {

    var row = rowById(moduleId, this.modules);

    if (!this.modules[row].module.isDisabled && row != -1)
    {
        this.modules[row].module.isDisabled = true;
        this.modules[row].module.onRemove();
    }
    else
    {
        this.modules[row].module.isDisabled = false;
        this.modules[row].module.onStart();
    }


};

ModuleControl.prototype.startModules = function () {
  for (i=0;i<this.modules.length;i++)
  {
      this.modules[i].module.onStart(this.modules[i].id);
  }
};