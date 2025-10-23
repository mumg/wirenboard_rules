function defineGroup(cfg){
  var ps = new PersistentStorage(cfg.name, {global: true});
  defineVirtualDevice(cfg.name, {
    title: cfg.title ,
    cells: {
      enabled: {
        title: "Включен",
        type: "switch",
        value: false
      }
    }
  });
  dev[cfg.name + "/enabled"] = ps.enabled || false;
  defineRule({
    whenChanged: cfg.name + "/enabled",
    then: function (newValue, devName, cellName) {
      ps.enabled = newValue;
    }
  }); 
}

function defineGroupGuard(name, params) {
    defineRule({
    whenChanged: name + "/enabled",
    then: function (newValue, devName, cellName) {
      if (newValue){
        params.off()
      }else{
        params.on()
      }
    }
  }); 
  if ( dev[name + "/enabled"]){
    params.off()
  }else{
    params.on()
  }
  return function (){
      if (!dev[name + "/enabled"]){
        params.on.apply(null, arguments);
      }
  }
}

global.__proto__.defineGroup = defineGroup
global.__proto__.defineGroupGuard = defineGroupGuard