/**
 * Created by Guillaume on 03/06/2015.
 */

ModuleControl = function ()
{
    this.modules = []
};

ModuleControl.prototype.add = function(moduleName, module)
{
    var id = (this.modules.length == 0)? 1 :this.modules[this.modules.length-1].id + 1;
    this.modules.push({id : id ,"name" : moduleName, "module" : module});
    console.log('Starting module', moduleName);

    var translations  = tabTranslations.translations;
    var translationsToAdd = [];


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

ModuleControl.prototype.remove = function(moduleName)
{

};

ModuleControl.prototype.startModules = function () {
  for (i=0;i<this.modules.length;i++)
  {
      this.modules[i].module.onStart(this.modules[i].id);
  }
};