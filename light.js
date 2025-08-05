function defineLightControl(name, title, states, safe, idle){
    var ps = new PersistentStorage(name, {global: true});
    defineVirtualDevice(name, {
        title: title,
        cells: {
            mode: {
                type: "value",
                title: "Режим",
                value: 0,
                readonly: true
            },
            next: {
                type: "switch",
                title: "Следующий",
                value: false,
                readonly: false
            },
            enabled: {
                type: "switch",
                title: "Включено",
                value: false,
                readonly: false
            },
            state: {
              type : "text",
              title: "Состояние",
              value: "",
              readonly: true
            }
        }
    });
    function _safe(){
        dev[name + "/state"] = "Безопасный режим"
        safe()
    }
   function _update(){
       if ( ps.enabled || false ){
          dev[name + "/state"] = "Включено"
          states[ps.mode || 0]();
       }else{
          dev[name + "/state"] = "Выключено"
          if( idle !== undefined ){
            idle()
          }
        }
    }
    dev[name + "/mode"] = ps.mode || 0;
    defineRule({
        whenChanged: name + "/mode",
        then: function (newValue, devName, cellName) {
            if (newValue >= states.length ){
                dev[name + "/mode"] = 0
            }else{
                ps.mode = newValue;
            }
        }
    })
    defineRule({
        whenChanged: name+"/next",
        then: function (newValue, devName, cellName) {
            if (newValue == true) {
                var current = dev[name + "/mode"];
                current++;
                if (current >= states.length) {
                    current = 0;
                }
                ps.mode = current;
                dev[name + "/mode"] = current;
                dev[name + "/next"] = false;
                _update();
            }
        }
    })
    var safeUpdate = defineSafetyGuard(_safe, _update)
    defineRule({
        whenChanged: name+"/enabled",
        then: function (newValue, devName, cellName) {
          ps.enabled = true;
          safeUpdate();
        }
    })
}

global.__proto__.defineLightControl = defineLightControl
