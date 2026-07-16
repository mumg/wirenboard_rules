defineSafetyGuard(
    function () {
       dev["wb-mwac-v2_57/Output K1"] = false
       dev["wb-mwac-v2_57/Output K2"] = false
       dev["wb-gpio/EXT1_K7"] = false
    },
    function() {
       dev["wb-mwac-v2_57/Output K1"] = true
       dev["wb-mwac-v2_57/Output K2"] = true
       dev["wb-gpio/EXT1_K7"] = true
    }
);


defineLightControl({
  name: "kitchen_light",
  title: "Свет на кухне",
  states: [
    function(){
      dev["wb-led_132/Channel 2 Brightness"] = 10
      dev["wb-led_132/Channel 2"] = true
      dev["wb-gpio/EXT1_K8"] = false
    },
    function(){
      dev["wb-led_132/Channel 2 Brightness"] = 100
      dev["wb-led_132/Channel 2"] = true
      dev["wb-gpio/EXT1_K8"] = false
    },
    function(){
      dev["wb-led_132/Channel 2 Brightness"] = 0
      dev["wb-led_132/Channel 2"] = false
      dev["wb-gpio/EXT1_K8"] = true
    }
  ],
  enabled: true,
  safe: function(){
      dev["wb-led_132/Channel 2 Brightness"] = 0
      dev["wb-led_132/Channel 2"] = false
      dev["wb-gpio/EXT1_K8"] = false
  }           
})

defineRule({
  whenChanged: ["wb-mcm8_30/Input 3 Single Press Counter", 
                "wb-mcm8_30/Input 2 Single Press Counter"],
  then: function (newValue, devName, cellName) {
    dev["kitchen_light/next"] = true
  }
});

defineLightControl({
  name: "kitchen_backlight",
  title: "Подсветка на кухне",
  states: [
    function(){
      dev["wb-led_132/Channel 1 Brightness"] = 0
      dev["wb-led_132/Channel 1"] = false
    },
    function(){
      dev["wb-led_132/Channel 1 Brightness"] = 10
      dev["wb-led_132/Channel 1"] = true
    },
    function(){
      dev["wb-led_132/Channel 1 Brightness"] = 20
      dev["wb-led_132/Channel 1"] = true
    },
    function(){
      dev["wb-led_132/Channel 1 Brightness"] = 30
      dev["wb-led_132/Channel 1"] = true
    },
    function(){
      dev["wb-led_132/Channel 1 Brightness"] = 40
      dev["wb-led_132/Channel 1"] = true
    },
    function(){
      dev["wb-led_132/Channel 1 Brightness"] = 50
      dev["wb-led_132/Channel 1"] = true
    },
    function(){
      dev["wb-led_132/Channel 1 Brightness"] = 60
      dev["wb-led_132/Channel 1"] = true
    },
    function(){
      dev["wb-led_132/Channel 1 Brightness"] = 70
      dev["wb-led_132/Channel 1"] = true
    },
    function(){
      dev["wb-led_132/Channel 1 Brightness"] = 80
      dev["wb-led_132/Channel 1"] = true
    },
    function(){
      dev["wb-led_132/Channel 1 Brightness"] = 90
      dev["wb-led_132/Channel 1"] = true
    },
    function(){
      dev["wb-led_132/Channel 1 Brightness"] = 100
      dev["wb-led_132/Channel 1"] = true
    }
  ], 
  safe: function(){
      dev["wb-led_132/Channel 1 Brightness"] = 0
      dev["wb-led_132/Channel 1"] = false
  }
});

defineRule({
  whenChanged: "kitchen_dimmer/action_rotation_angle",
  then: function(newValue){
    var angle = parseInt(newValue);
    if ( angle != 0){
      dev["kitchen_backlight/change"] = angle / 12
      dev["kitchen_dimmer/action_rotation_angle"] = "0"
    }
  }
})
