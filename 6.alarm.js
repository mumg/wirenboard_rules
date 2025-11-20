function defineAlarm(cfg){
    defineVirtualDevice(cfg.name,
                      {
                        title: (cfg.title || cfg.name),
                        cells: {
                          active: {
                              type: "switch",
                              title: "Включено",
                              value: false,
                              readonly: true
                          },
                          cancel: {
                              type: "pushbutton",
                              title: "Отменить",
                              value: false
                          }
                        }
                      })
  var timer = undefined;
  defineRule({
    whenChanged: cfg.name + "/active",
    then: function(newValue){
      if( !newValue){
        if (timer !== undefined){
          clearTimeout(timer)
        }
        timer = undefined
      }else{
        if(cfg.timeout){
          timer = setTimeout(function(){
            timer = undefined
            dev[cfg.name + "/active"] = false
          }, cfg.timeout * 1000)
        }
      }
    }
  })
  defineRule({
    whenChanged: cfg.name + "/cancel",
    then: function(){
      dev[cfg.name + "/active"] = false
    }
  })
}

global.__proto__.defineAlarm = defineAlarm