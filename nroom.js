defineLightControl({
    name: "nroom_light",
    title: "Свет в комнате Никиты",
    states: [
        function () {
          dev["wb-gpio/EXT2_K4"] = false
          dev["wb-led_132/Channel 4"] = false
          dev["wb-led_132/Channel 4 Brightness"] = 0
        },
        function () {
            dev["wb-gpio/EXT2_K4"] = false
            dev["wb-led_132/Channel 4"] = true
            dev["wb-led_132/Channel 4 Brightness"] = 10
        },
        function () {
            dev["wb-gpio/EXT2_K4"] = false
            dev["wb-led_132/Channel 4"] = true
            dev["wb-led_132/Channel 4 Brightness"] = 100
        },
        function () {
            dev["wb-gpio/EXT2_K4"] = true
            dev["wb-led_132/Channel 4"] = true
            dev["wb-led_132/Channel 4 Brightness"] = 50
        },
        function () {
            dev["wb-gpio/EXT2_K4"] = false
            dev["wb-led_132/Channel 4"] = true
            dev["wb-led_132/Channel 4 Brightness"] = 10
        }
    ],
    safe: function() {

          dev["wb-gpio/EXT2_K4"] = false
          dev["wb-led_132/Channel 4"] = false
          dev["wb-led_132/Channel 4 Brightness"] = 0
    }
})

defineRule({
  whenChanged: ["wb-mcm8_30/Input 6 Single Press Counter",
                "wb-mcm8_1/Input 1 Single Press Counter"],
  then: function(){
    dev["nroom_light/next"] = true
  }
})

defineRule({
  whenChanged: ["wb-mcm8_30/Input 6 Long Press Counter",
                "wb-mcm8_1/Input 1 Long Press Counter"],
  then: function(){
    if (dev["nikita_curtain/Position"] < 50){
      dev["nikita_curtain/Open"] = true
    }else{
      dev["nikita_curtain/Close"] = true
    }
  }
})

defineGroup({
  name: "nikita_night_mode",
  title: "Ночной режим у Никиты"
})

defineGroupGuard("nikita_night_mode",
                 {
                   on: function(){
                     dev["nroom_light/safe"] = false
                     dev["wb-gpio/EXT2_K3"] = true
                   },
                   off: function(){
                     dev["nikita_curtain/Close"] = true
                     dev["nroom_light/safe"] = true
                     dev["wb-gpio/EXT2_K3"]= false
                   }
                 })

defineRule({
  whenChanged: "wb-mcm8_30/Input 8 Long Press Counter",
  then: function(){
    dev["nikita_night_mode/enabled"] = true
  }
})

defineRule({
  whenChanged: "wb-mcm8_30/Input 8 Single Press Counter",
  then: function(){
    dev["nikita_night_mode/enabled"] = false
  }
})


defineThreshold({
  name: "nikita_thresholds",
  title: "Пороги автоматизации у Никиты",
  points: [
    {
      dev: "wb-msw-v4_80/CO2",
      name: "CO2",
      title: "Порог C02",
      thresholds: [
        {
          high: 549,
          title: "Бризер 1 скорость",
          then: function(){
            dev["breezer_nikita/Fan speed"] = 1
          }
        },
        {
          low: 550,
          high: 599,
          title: "Бризер 2 скорость",
          then: function(){
            dev["breezer_nikita/Fan speed"] = 2
          }
        },
        {
          low: 600,
          high: 649,
          title: "Бризер 3 скорость",
          then: function(){
            dev["breezer_nikita/Fan speed"] = 3
          }
        },
        {
          low: 650,
          high: 699,
          title: "Бризер 4 скорость",
          then: function(){
            dev["breezer_nikita/Fan speed"] = 4
          }
        },
        {
          low: 700,
          high: 999,
          title: "Бризер 5 скорость",
          then: function(){
            dev["breezer_nikita/Fan speed"] = 5
          }
        },
        {
          low: 1000,
          title: "Бризер 6 скорость",
          then: function(){
            dev["breezer_nikita/Fan speed"] = 6
          }
        }
      ]
    }
  ]
})
