defineLightControl({
  name: "kroom_light", 
  title: "Свет в комнате Кристины",
  states: [
    function(){
      dev["wb-led_132/Channel 3"] = false
      dev["wb-gpio/EXT1_K6"] = false
    },
    function(){
      dev["wb-led_132/Channel 3 Brightness"] = 10
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
      dev["wb-led_132/Channel 3 Brightness"] = 10
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
    {
      dev: "wb-msw-v4_75/CO2",
      name: "CO2",
      title: "Порог C02",
      thresholds: [
        {
          high: 549,
          title: "Бризер 1 скорость",
          then: function(){
            dev["breezer_kristina/Fan speed"] = 1
          }
        },
        {
          low: 550,
          high: 599,
          title: "Бризер 2 скорость",
          then: function(){
            dev["breezer_bedroom/Fan speed"] = 2
          }
        },
        {
          low: 600,
          high: 649,
          title: "Бризер 3 скорость",
          then: function(){
            dev["breezer_kristina/Fan speed"] = 3
          }
        },
        {
          low: 650,
          high: 699,
          title: "Бризер 4 скорость",
          then: function(){
            dev["breezer_kristina/Fan speed"] = 4
          }
        },
        {
          low: 700,
          high: 999,
          title: "Бризер 5 скорость",
          then: function(){
            dev["breezer_kristina/Fan speed"] = 5
          }
        },
        {
          low: 1000,
          title: "Бризер 6 скорость",
          then: function(){
            dev["breezer_kristina/Fan speed"] = 6
          }
        }
      ]
    }
  ]
})