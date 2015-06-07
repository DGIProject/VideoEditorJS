/**
 * Created by Guillaume on 03/06/2015.
 */

ModuleControl = function ()
{
    this.modules = []
};

ModuleControl.prototype.add = function(moduleName, module)
{
    var id = (this.modules.length == 0)? 1 :this.module[this.modules.length-1].id + 1;
    this.modules.push({id : id ,"name" : moduleName, "module" : module});
    console.log('Starting module', moduleName);

    if (this.modules[this.modules.length-1].module.lang.hasOwnProperty(tabTranslations.lang))
    {
        console.log("concat", this.modules[this.modules.length-1].module.lang[tabTranslations.lang]);
        tabTranslations.translations.concat(this.modules[this.modules.length-1].module.lang[tabTranslations.lang]);
    }
    else
    {
        console.log("concat default",this.modules[this.modules.length-1].module.lang[this.modules[this.modules.length-1].module.lang.default] );
        tabTranslations.translations.concat(this.modules[this.modules.length-1].module.lang[this.modules[this.modules.length-1].module.lang.default]);
    }

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