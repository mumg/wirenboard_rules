function definePresenceControl(presence_dev, threshold, timeout, enable){
  var sm = createSM({
                    },
                    {
                      idle:{
                        enter: function(sm){
                          enable(false)
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
                          enable(true)
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
    whenChanged: presence_dev,
    then: function(newValue, devName, cellName){
      sm.handle(sm, "presence", newValue)
    }
  })
  return function(){
    sm.handle(sm, "toggle")
  }
}

global.__proto__.definePresenceControl = definePresenceControl