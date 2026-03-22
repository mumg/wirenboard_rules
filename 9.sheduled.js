function defineSheduledSwitch(cfg){
  defineVirtualDevice(cfg.name,{
    title: cfg.title,
    cells: {
      enabled: {
        type: "switch",
        readonly: false,
        value: false,
        title: "Включено"
      },
      on: {
        type: "text",
        readonly: false,
        value: "07:00",
        title: "Включить в"
      },
      off: {
        type: "text",
        readonly: false,
        value: "22:00",
        title: "Выключить в"
      }
    }
  })

  function parseTime(tm){
    var t = tm.split(':');
    return 60 * parseInt(t[0], 10) + parseInt(t[1], 10)
  }
  
  setInterval( function() { 
    var dt = new Date()
    var curr = 60 * dt.getHours() + dt.getMinutes()
    var ton = parseTime(dev[cfg.name + "/on"])
    var toff = parseTime(dev[cfg.name + "/off"])

    var state = dev[cfg.name + "/enabled"]
    if( state ){
      //on
      log.info("curr=" + curr + " and toff=" + toff)
      if(curr == toff){
        dev[cfg.name + "/enabled"] = false
      }
    }else{
      log.info("curr=" + curr + " and ton=" + ton)
      if ( curr == ton ){
        dev[cfg.name + "/enabled"] = true
      }
    }
  }, 60000);

  defineRule({
    whenChanged: cfg.name + "/enabled",
    then: function(newValue){
      log.info("enabled "+ newValue)
       cfg.enabled(newValue)
    }
  });
}

global.__proto__.defineSheduledSwitch = defineSheduledSwitch