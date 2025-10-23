defineLightControl({
  name: "bathroom_light", 
  title: "Свет в душевой",
  states: [
      function(){
          dev["wb-led_136/Channel 3"] = true
          dev["wb-led_136/Channel 3 Brightness"] = 100
          dev["wb-gpio/EXT2_K1"] = false
      },
      function(){
          dev["wb-led_136/Channel 3"] = true
          dev["wb-led_136/Channel 3 Brightness"] = 100
          dev["wb-gpio/EXT2_K1"] = true
      }
  ], 
  safe: function(){
      dev["wb-led_136/Channel 3"] = false
      dev["wb-led_136/Channel 3 Brightness"] = 0
      dev["wb-gpio/EXT2_K1"] = false
  },
  idle: function(){
      dev["wb-led_136/Channel 3"] = true
      dev["wb-led_136/Channel 3 Brightness"] = 10
      dev["wb-gpio/EXT2_K1"] = false
  }
})

defineSafetyGuard(
  function(){
    dev["wb-gpio/EXT3_K5"] = false
  },
  function(){
    dev["wb-gpio/EXT3_K5"] = true
  }
)

definePresenceControl("bathroom_presence",
                      "Присутсвие в душе",
                      "wb-msw-v4_28/Current Motion",
                      100,
                      300000)

defineRule({
  whenChanged: "wb-mcm8_1/Input 5",
  then: function(newValue){
    if( newValue){
      dev["bathroom_light/enabled"] = !dev["bathroom_light/enabled"]
    }
  }
})