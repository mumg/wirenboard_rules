var ps = new PersistentStorage("safety", {global: true});

dev["safety/enabled"] = ps.enabled || false;

defineVirtualDevice("safety", {
    title: "Безопасный режим" ,
    cells: {
      enabled: {
        title: "Включен",
        type: "switch",
        value: false
      }
    }
});

defineRule({
    whenChanged: "safety/enabled",
    then: function (newValue, devName, cellName) {
      ps.enabled = newValue
    }
});


function defineSafetyGuard(safe, work){
  defineRule({
    whenChanged: "safety/enabled",
    then: function (newValue, devName, cellName) {
      if (newValue){
        safe()
      }else{
        work()
      }
    }
  }); 
  if ( dev["safety/enabled"]){
    safe()
  }else{
    work()
  }
  return function (){
      if (!dev["safety/enabled"]){
        work.apply(null, arguments);
      }
  }
}

global.__proto__.defineSafetyGuard = defineSafetyGuard