function defineTimer(cfg){
  defineVirtualDevice(cfg.name,{
    title: cfg.title,
    cells: {
            activate: {
              type: "pushbutton",
              title: "Активировать",
              value: false,
              readonly: false
            },
            cancel: {
              type: "pushbutton",
              title: "Остановить",
              value: false,
              readonly: false
            },
            active: {
                type: "switch",
                title: "Активен",
                value: false,
                readonly: true
            },
            remaining: {
                type: "value",
                title: "Осталось",
                value: 0,
                readonly: true
            }
    } 
  })
  var sm = createSM({
                      end: 0
                    },
                    {
                      idle:{
                        enter: function(sm){
                          dev[cfg.name + "/active"] = false
                          dev[cfg.name + "/remaining"] = 0
                          if ( cfg.active){
                            cfg.active(false)
                          }
                        },
                        activate: function(sm, evt, value){
                          sm.change(sm, "active")
                        }
                      },
                      canceled:{
                        enter: function(sm){
                          dev[cfg.name + "/active"] = false
                          dev[cfg.name + "/remaining"] = 0
                        },
                        activate: function(sm, evt, value){
                          sm.change(sm, "active")
                        }
                      },
                      active: {
                        enter: function(sm){
                          sm.startTimer(sm, "timeout", cfg.timeout)
                          sm.startTimer(sm, "tick", 1000)
                          dev[cfg.name + "/active"] = true
                          dev[cfg.name + "/remaining"] = Math.floor(cfg.timeout/1000)
                          sm.context.end = Date.now() + cfg.timeout
                          if ( cfg.active){
                            cfg.active(true)
                          }
                        },
                        exit: function(sm){
                          sm.stopTimer(sm, "timeout")
                          sm.stopTimer(sm, "tick")
                        },
                        tick: function(sm, evt, value){
                          sm.startTimer(sm, "tick", 1000)
                          dev[cfg.name + "/remaining"] = Math.floor((sm.context.end - Date.now())/1000)
                        },
                        timeout: function(sm, evt, value){
                          sm.change(sm, "idle")
                        },
                        activate: function(sm, evt, value){
                          sm.change(sm, "active")
                        },
                        cancel: function(sm, evt, value){
                          sm.change(sm, "canceled")
                        }
                      }
                    }, "idle")
  defineRule({
    whenChanged: cfg.name + "/activate",
    then: function(newValue, devName, cellName){
      sm.handle(sm, "activate")
    }
  })
    defineRule({
    whenChanged: cfg.name + "/cancel",
    then: function(newValue, devName, cellName){
      sm.handle(sm, "cancel")
    }
  })
}

global.__proto__.defineTimer = defineTimer

function delayRun(timeout, cb){
  var tm = setTimeout(timeout, cb)
  return function(){
    if ( tm !== undefined ){
      cancelTimeout(tm)
      tm = undefined
    }
  }
}

global.__proto__.delayRun = delayRun