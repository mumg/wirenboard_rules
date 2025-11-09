defineLightControl({
  name: "toilet_light", 
  title: "Свет в туалете",
  states: [
      function(){
          dev["wb-led_136/Channel 2"] = true
          dev["wb-led_136/Channel 2 Brightness"] = 20
          dev["wb-gpio/EXT2_K2"] = false
      },
      function(){
          dev["wb-led_136/Channel 2"] = true
          dev["wb-led_136/Channel 2 Brightness"] = 100
          dev["wb-gpio/EXT2_K2"] = true
      },
      function(){
          dev["wb-led_136/Channel 2"] = true
          dev["wb-led_136/Channel 2 Brightness"] = 100
          dev["wb-gpio/EXT2_K2"] = true
      }
  ], 
  safe: function(){
      dev["wb-led_136/Channel 2"] = false
      dev["wb-led_136/Channel 2 Brightness"] = 0
      dev["wb-gpio/EXT2_K2"] = false
  }
})

defineRule({
  whenChanged: "wb-mcm8_1/Input 4",
  then: function(newValue){
    if( newValue){
      if (dev["toilet_light/mode"] == 0){
        dev["toilet_light/mode"] = 2
      }else{
        dev["toilet_light/mode"] = 0
      }
    }
  }
})

defineTimer({
  name: "toilet_fan_timer",
  title: "Таймер вентилятора в туалете",
  timeout: 300000
})

defineTimer({
  name: "toilet_light_timer",
  title: "Таймер света в туалете",
  timeout: 60000,
  active: function(state){
    if ( dev["toilet_light/mode"] == 2){
      return
    }
    if ( state){
      dev["toilet_light/mode"] = 1
    }else{
      dev["toilet_light/mode"] = 0
    }
  }
})

defineRule({
  whenChanged: "toilet_fan_timer/active",
  then: function(newValue){
    dev["wb-mr6cu_101/K5"] = newValue
  }
})

defineRule({
  whenChanged: "tp/presence",
  then: function(newValue){
    log.info("tp/presense=" + newValue)
    if(newValue === "false"){
      dev["toilet_fan_timer/activate"] = true
    }else{
      dev["toilet_light/mode"] =1
    }
    if ( dev["toilet_light/mode"] == 2){
      return
    }
    if(newValue === "false"){
      dev["toilet_light_timer/activate"] = true
    }else{
      dev["toilet_light_timer/cancel"] = true
    }
  }
})

