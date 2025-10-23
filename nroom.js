defineLightControl({
    name: "nroom_light",
    title: "Свет в комнате Никиты",
    states: [
        function () {
            dev["wb-gpio/EXT2_K4"] = false
            dev["wb-led_132/Channel 4"] = true
            dev["wb-led_132/Channel 4 Brightness"] = 50
        },
        function () {
            dev["wb-gpio/EXT2_K4"] = false
            dev["wb-led_132/Channel 4"] = true
            dev["wb-led_132/Channel 4 Brightness"] = 100
        },
        function () {
            dev["wb-gpio/EXT2_K4"] = true
            dev["wb-led_132/Channel 4"] = false
            dev["wb-led_132/Channel 4 Brightness"] = 0
        },
        function () {
            dev["wb-gpio/EXT2_K4"] = true
            dev["wb-led_132/Channel 4"] = true
            dev["wb-led_132/Channel 4 Brightness"] = 100
        }
    ],
    safe: function() {
        dev["wb-gpio/EXT2_K4"] = false
        dev["wb-led_132/Channel 4"] = false
        dev["wb-led_132/Channel 4 Brightness"] = 0

    },
    idle: function() {
        dev["wb-gpio/EXT2_K4"] = false
        dev["wb-led_132/Channel 4"] = true
        dev["wb-led_132/Channel 4 Brightness"] = 5
    }
})

defineRule({
  whenChanged: ["wb-mcm8_30/Input 6 Single Press Counter",
                "wb-mcm8_1/Input 1 Single Press Counter"],
  then: function(){
    dev["nroom_light/enabled"] = !dev["nroom_light/enabled"]
  }
})

defineRule({
  whenChanged: ["wb-mcm8_30/Input 6 Double Press Counter",
                "wb-mcm8_1/Input 1 Double Press Counter"],
  then: function(){
    dev["nroom_light/next"] = true
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
                     dev["nikita_curtain/Open"] = true
                     dev["wb-gpio/EXT2_K3"] = true
                   },
                   off: function(){
                     dev["nroom_light/safe"] = true
                     dev["nikita_curtain/Close"] = true
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