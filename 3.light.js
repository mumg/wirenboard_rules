function defineLightControl(cfg){
    var ps = new PersistentStorage(cfg.name, {global: true});
    var vd = {
        title: cfg.title,
        cells: {
            enabled: {
                type: "switch",
                title: "Включено",
                value: false,
                readonly: false
            }
        }
    };
    if (cfg.states.length > 1){
      vd.cells["mode"] =  {
                type: "value",
                title: "Режим",
                value: 0,
                readonly: true
      }
      vd.cells["next"] = {
                type: "pushbutton",
                title: "Следующий",
                value: false,
                readonly: false
      }
      vd.cells["change"] = {
              type: "value",
              title: "Изменить режим",
              value: 0,
              readonly: false
       }
    }

  if(cfg.safe){
    vd.cells["safe"] = {
      type: "switch",
      title: "Безопасный режим",
      value: false,
      readonly: false
    }
  }

    defineVirtualDevice(cfg.name, vd );
    
    function _safe(){
        cfg.safe()
    }
   function _update(){
       if ( ps.enabled || false ){
          cfg.states[ps.mode || 0]();
       }else{
          if( cfg.idle !== undefined ){
            cfg.idle()
          }
        }
    }
    if (cfg.states.length > 1){
      dev[cfg.name + "/mode"] = ps.mode || 0;
      defineRule({
          whenChanged: cfg.name + "/mode",
          then: function (newValue, devName, cellName) {
              if (newValue >= cfg.states.length ){
                  dev[cfg.name + "/mode"] = 0
              }else{
                  ps.mode = newValue;
              }
              _update();
          }
      })
      defineRule({
          whenChanged: cfg.name+"/next",
          then: function (newValue, devName, cellName) {
              if (newValue == true) {
                  var current = dev[cfg.name + "/mode"];
                  current++;
                  if (current >= cfg.states.length) {
                      current = 0;
                  }
                  ps.mode = current;
                  dev[cfg.name + "/mode"] = current;
                  dev[cfg.name + "/next"] = false;
              }
          }
      })
      defineRule({
          whenChanged: cfg.name+"/change",
          then: function (newValue, devName, cellName) {
              if (newValue != 0) {
                  var current = dev[cfg.name + "/mode"];
                  current += newValue;
                  if (current < 0 ){
                    current = 0
                  }
                  if (current >= cfg.states.length) {
                      current = cfg.states.length - 1;
                  }
                  ps.mode = current;
                  dev[cfg.name + "/mode"] = current;
                  dev[cfg.name + "/change"] = 0;
              }
          }
      })
    }
    if (cfg.safe){
      defineRule({
        whenChanged: cfg.name+"/safe",
        then: function(newValue){
          if(newValue){
            _safe()
          }else{
            _update()
          }
        }
      })
      defineSafetyGuard(
        function(){
          dev[cfg.name+"/safe"] = true
        }, function(){
          dev[cfg.name+"/safe"] = false
        })
      defineRule({
          whenChanged: cfg.name+"/enabled",
          then: function (newValue, devName, cellName) {
            ps.enabled = newValue;
            _update();
          }
      })
    }else{
      defineRule({
          whenChanged: cfg.name+"/enabled",
          then: function (newValue, devName, cellName) {
            ps.enabled = newValue;
            _update();
          }
      })
    }

}

global.__proto__.defineLightControl = defineLightControl
