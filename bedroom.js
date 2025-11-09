defineLightControl({
  name: "bedroom_light",
  title: "Свет в спальне",
  states: [    
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
    },
    function(){
      dev["wb-led_136/Channel 4"] = false
      dev["wb-led_136/Channel 4 Brightness"] = 0
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

defineThreshold({
  name: "bedroom_thresholds",
  title: "Пороги автоматизации в спальне",
  points: [
    {
      dev: "wb-msw-v4_36/CO2",
      name: "CO2",
      title: "Порог C02",
      thresholds: [
        {
          high: 549,
          title: "Бризер 1 скорость",
          then: function(){
            dev["breezer_bedroom/Fan speed"] = 1
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
            dev["breezer_bedroom/Fan speed"] = 3
          }
        },
        {
          low: 650,
          high: 699,
          title: "Бризер 4 скорость",
          then: function(){
            dev["breezer_bedroom/Fan speed"] = 4
          }
        },
        {
          low: 700,
          high: 999,
          title: "Бризер 5 скорость",
          then: function(){
            dev["breezer_bedroom/Fan speed"] = 5
          }
        },
        {
          low: 1000,
          title: "Бризер 6 скорость",
          then: function(){
            dev["breezer_bedroom/Fan speed"] = 6
          }
        }
      ]
    }
  ]
})
