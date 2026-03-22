defineLightControl({
  name: "bedroom_light",
  title: "Свет в спальне",
  states: [   
    function(){
      dev["wb-led_136/Channel 4"] = false
      dev["wb-led_136/Channel 4 Brightness"] = 0
      dev["wb-gpio/EXT1_K4"] = false
    },
    function(){
      dev["wb-led_136/Channel 4"] = true
      dev["wb-led_136/Channel 4 Brightness"] = 10
      dev["wb-gpio/EXT1_K4"] = false
    },
    function(){
      dev["wb-led_136/Channel 4"] = true
      dev["wb-led_136/Channel 4 Brightness"] = 100
      dev["wb-gpio/EXT1_K4"] = false
    },
    function(){
      dev["wb-led_136/Channel 4"] = true
      dev["wb-led_136/Channel 4 Brightness"] = 100
      dev["wb-gpio/EXT1_K4"] = true
    },
    function(){
      dev["wb-led_136/Channel 4"] = true
      dev["wb-led_136/Channel 4 Brightness"] = 100
      dev["wb-gpio/EXT1_K4"] = false
    },
    function(){
      dev["wb-led_136/Channel 4"] = true
      dev["wb-led_136/Channel 4 Brightness"] = 5
      dev["wb-gpio/EXT1_K4"] = false
    }
  ],
  safe: function(){
      dev["wb-led_136/Channel 4"] = false
      dev["wb-led_136/Channel 4 Brightness"] = 0
      dev["wb-gpio/EXT1_K4"] = false
  },
  idle: function(){
      dev["wb-led_136/Channel 4"] = false
      dev["wb-led_136/Channel 4 Brightness"] = 0
      dev["wb-gpio/EXT1_K4"] = false
  }
});

defineLightControl({
  name: "balcony_light",
  title: "Свет на балконе",
  states: [
    function(){
      dev["wb-gpio/EXT1_K1"] = false
    },
    function(){
      dev["wb-gpio/EXT1_K1"] = true
    }
  ],
  safe: function(){
      dev["wb-gpio/EXT1_K1"] = false
  }
});


defineSafetyGuard(
  function(){
    dev["wb-gpio/EXT1_K3"] = false
  },
  function(){
    dev["wb-gpio/EXT1_K3"] = true
  }
)

defineRule({
  whenChanged: "wb-mcm8_1/Input 6 Single Press Counter",
  then: function(){
    dev["balcony_light/next"] = true
  }
})

defineRule({
  whenChanged: ["wb-mcm8_227/Input 3 Single Press Counter", 
                "wb-mcm8_227/Input 4 Single Press Counter",
                "wb-mcm8_1/Input 8 Single Press Counter",
                "wb-mcm8_1/Input 7 Single Press Counter"],
  then: function(){
    dev["bedroom_light/next"] = true
  }
})

defineRule({
  whenChanged: ["wb-mcm8_227/Input 3 Long Press Counter", 
                "wb-mcm8_227/Input 4 Long Press Counter",
                "wb-mcm8_1/Input 8 Long Press Counter",
                "wb-mcm8_1/Input 7 Long Press Counter"],
  then: function(){
    dev["bedroom_light/mode"] = 0
    dev["balcony_light/mode"] = 0
  }
})

defineRule({
  whenChanged: ["wb-mcm8_227/Input 3 Double Press Counter", 
                "wb-mcm8_227/Input 4 Double Press Counter",
                "wb-mcm8_1/Input 8 Double Press Counter",
                "wb-mcm8_1/Input 7 Double Press Counter"],
  then: function(){
    dev["bedroom_light/mode"] = 5
    dev["balcony_light/mode"] = 0
  }
})

defineThreshold({
  name: "bedroom_thresholds",
  title: "Пороги автоматизации в спальне",
  points: [
    createDioxideThreshold("wb-msw-v4_36/CO2", "breezer_bedroom/Fan speed"),
    createHeaterThreshold("jls30h_14/Temperature","wb-mao4_204/Channel 1 Dimming Level")
  ]
})
