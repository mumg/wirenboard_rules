defineLightControl({
  name: "kroom_light", 
  title: "Свет в комнате Кристины",
  states: [
    function(){
      dev["wb-led_132/Channel 3"] = false
      dev["wb-gpio/EXT1_K6"] = false
    },
    function(){
      dev["wb-led_132/Channel 3 Brightness"] = 5
      dev["wb-led_132/Channel 3"] = true
      dev["wb-gpio/EXT1_K6"] = false
    },
    function(){
      dev["wb-led_132/Channel 3 Brightness"] = 100
      dev["wb-led_132/Channel 3"] = true
      dev["wb-gpio/EXT1_K6"] = false
    },
    function(){
      dev["wb-led_132/Channel 3 Brightness"] = 50
      dev["wb-led_132/Channel 3"] = true
      dev["wb-gpio/EXT1_K6"] = true
    },
    function(){
      dev["wb-led_132/Channel 3 Brightness"] = 2
      dev["wb-led_132/Channel 3"] = true
      dev["wb-gpio/EXT1_K6"] = false
    }
  ], 
  safe: function(){
      dev["wb-led_132/Channel 3"] = false
      dev["wb-gpio/EXT1_K6"] = false
  }
})

defineSafetyGuard(
  function(){
    dev["wb-gpio/EXT2_K8"] = false
  },
  function(){
    dev["wb-gpio/EXT2_K8"] = true
  }
)

defineRule({
  whenChanged: ["wb-mcm8_227/Input 6 Single Press Counter",
                "wb-mcm8_227/Input 5 Single Press Counter"],
  then: function(){
    dev["kroom_light/next"] = true
  }
})

defineRule({
  whenChanged: ["wb-mcm8_227/Input 6 Long Press Counter",
                "wb-mcm8_227/Input 5 Long Press Counter"],
  then: function(){
    if (dev["kristina_curtain/Position"] < 50){
      dev["kristina_curtain/Open"] = true
    }else{
      dev["kristina_curtain/Close"] = true
    }
  }
})


defineThreshold({
  name: "kristina_thresholds",
  title: "Пороги автоматизации у Кристины",
  points: [
    createDioxideThreshold("wb-msw-v4_75/CO2", "breezer_kristina/Fan speed")
  ]
})