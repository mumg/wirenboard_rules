defineLightControl({
  name: "bedroom_light",
  title: "Свет в спальне",
  states: [    
    function(){
      dev["wb-gpio/EXT1_K4"] = true
    }
  ],
  safe: function(){
      dev["wb-gpio/EXT1_K4"] = false
  },
  idle: function(){
      dev["wb-gpio/EXT1_K4"] = false
  }
});

defineLightControl({
  name: "balcony_light",
  title: "Свет на балконе",
  states: [    
    function(){
      dev["wb-gpio/EXT1_K1"] = true
    }
  ],
  safe: function(){
      dev["wb-gpio/EXT1_K1"] = false
  },
  idle: function(){
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
    dev["balcony_light/enabled"] = !dev["balcony_light/enabled"]
  }
})

defineRule({
  whenChanged: ["wb-mcm8_227/Input 3 Single Press Counter", "wb-mcm8_227/Input 4 Single Press Counter"],
  then: function(){
    dev["bedroom_light/enabled"] = !dev["bedroom_light/enabled"]
  }
})

defineThreshold({
  name: "bedroom_thresholds",
  title: "Пороги автоматизации в спальне",
  points: [
    {
      dev: "cwt-saq-8-ch_4/CO2",
      name: "CO2",
      title: "Порог C02",
      thresholds: [
        {
          high: 449,
          title: "Бризер выключен",
          then: function(){
            dev["breezer_bedroom/Active"] = false
            dev["breezer_bedroom/Fan speed"] = 1
          }
        },
        {
          low: 450,
          high: 549,
          title: "Бризер 1 скорость",
          then: function(){
            dev["breezer_bedroom/Active"] = True
            dev["breezer_bedroom/Fan speed"] = 1
          }
        },
        {
          low: 550,
          high: 599,
          title: "Бризер 2 скорость",
          then: function(){
            dev["breezer_bedroom/Active"] = True
            dev["breezer_bedroom/Fan speed"] = 2
          }
        },
        {
          low: 600,
          high: 649,
          title: "Бризер 3 скорость",
          then: function(){
            dev["breezer_bedroom/Active"] = True
            dev["breezer_bedroom/Fan speed"] = 3
          }
        },
        {
          low: 650,
          high: 699,
          title: "Бризер 4 скорость",
          then: function(){
            dev["breezer_bedroom/Active"] = True
            dev["breezer_bedroom/Fan speed"] = 4
          }
        },
        {
          low: 700,
          high: 999,
          title: "Бризер 5 скорость",
          then: function(){
            dev["breezer_bedroom/Active"] = True
            dev["breezer_bedroom/Fan speed"] = 5
          }
        },
        {
          low: 1000,
          title: "Бризер 6 скорость",
          then: function(){
            dev["breezer_bedroom/Active"] = True
            dev["breezer_bedroom/Fan speed"] = 6
          }
        }
      ]
    }
  ]
})
