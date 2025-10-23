defineLightControl({
  name: "toilet_light", 
  title: "Свет в туалете",
  states: [
      function(){
          dev["wb-led_136/Channel 2"] = true
          dev["wb-led_136/Channel 2 Brightness"] = 100
          dev["wb-gpio/EXT2_K2"] = false
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
  },
  idle: function(){
      dev["wb-led_136/Channel 2"] = true
      dev["wb-led_136/Channel 2 Brightness"] = 50
      dev["wb-gpio/EXT2_K2"] = false
  }
})

definePresenceControl("toilet_presence",
                      "Присутсвие в туалете",
                      "wb-msw-v4_169/Current Motion",
                      100,
                      300000)

defineRule({
  whenChanged: "wb-mcm8_1/Input 4",
  then: function(newValue){
    if( newValue){
      dev["toilet_light/enabled"] = !dev["toilet_light/enabled"]
    }
  }
})

