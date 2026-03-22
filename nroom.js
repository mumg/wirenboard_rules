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
  whenChanged: ["wb-mcm8_30/Input 6 Double Press Counter",
                "wb-mcm8_1/Input 1 Double Press Counter"],
  then: function(){
    dev["nroom_light/mode"] = 0
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
                     dev["nikita_tv/enabled"] = true
                   },
                   off: function(){
                     dev["nikita_curtain/Close"] = true
                     dev["nroom_light/safe"] = true
                     dev["wb-gpio/EXT2_K3"]= false
                     dev["nikita_tv/enabled"] = false
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
    createDioxideThreshold("wb-msw-v4_80/CO2", "breezer_nikita/Fan speed"),
    createHeaterThreshold("jls30h_14/Temperature","wb-mao4_204/Channel 2 Dimming Level")
  ]
})

defineVirtualDevice("nikita_tv", {
  title: "Телевизор у Никиты",
  cells: {
    enabled: {
      type: "switch",
      value: false,
      title: "Включен"
    }
  }
});

defineRule({
  whenChanged: "nikita_tv/enabled",
  then: function(newValue){
    if(newValue){
      publish("zigbee2mqtt/ntv/set", JSON.stringify({ state: "ON" }), 2, false);
    }else{
      publish("zigbee2mqtt/ntv/set", JSON.stringify({ state: "OFF" }), 2, false);
    }
  }
})
