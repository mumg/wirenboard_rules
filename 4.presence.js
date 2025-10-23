function definePresenceControl(name, title, source, threshold, timeout){
  defineVirtualDevice(name,{
    title: title,
    cells: {
            presence: {
                type: "switch",
                title: "Присутствие",
                value: false,
                readonly: true
            }
    } 
  })
  var sm = createSM({
                    },
                    {
                      idle:{
                        enter: function(sm){
                          dev[name + "/presence"] = false
                        },
                        presence: function(sm, evt, value){
                          if(value >= threshold){
                            sm.change(sm, "active")
                          }
                        },
                        toggle: function(sm, evt, value){
                          sm.change(sm, "active")
                        }
                      },
                      active: {
                        enter: function(sm){
                          sm.startTimer(sm, "timeout", timeout)
                          dev[name + "/presence"] = true
                        },
                        exit: function(sm){
                          sm.stopTimer(sm, "timeout")
                        },
                        presence: function(sm, evt, value){
                          if(value >= threshold){
                            sm.change(sm, "active")
                          }
                        },
                        toggle: function(sm, evt, value){
                          sm.change(sm, "idle")
                        },
                        timeout: function(sm, evt, value){
                          sm.change(sm, "idle")
                        }
                      }
                    }, "idle")
  defineRule({
    whenChanged: source,
    then: function(newValue, devName, cellName){
      sm.handle(sm, "presence", newValue)
    }
  })
}

global.__proto__.definePresenceControl = definePresenceControl