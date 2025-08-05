defineSafetyGuard(
    function () {
       dev["wb-mwac-v2_57/Output K1"] = false
       dev["wb-mwac-v2_57/Output K2"] = false
    },
    function() {
       dev["wb-mwac-v2_57/Output K1"] = true
       dev["wb-mwac-v2_57/Output K2"] = true
    }
);


defineLightControl("kitchen_light",
                   "Свет на кухне",
  [
    function(){
      dev["wb-led_132/Channel 1 Brightness"] = 50
      dev["wb-led_132/Channel 1"] = true
      dev["wb-gpio/EXT1_K8"] = false
    },
    function(){
      dev["wb-led_132/Channel 1 Brightness"] = 100
      dev["wb-led_132/Channel 1"] = true
      dev["wb-gpio/EXT1_K8"] = true
    }
  ],
  function(){
      dev["wb-led_132/Channel 1 Brightness"] = 0
      dev["wb-led_132/Channel 1"] = false
      dev["wb-gpio/EXT1_K8"] = false
  },
  function(){
      dev["wb-led_132/Channel 1 Brightness"] = 10
      dev["wb-led_132/Channel 1"] = true
      dev["wb-gpio/EXT1_K8"] = false
  }               
)

defineRule({
  whenChanged: "wb-mcm8_30/Input 3 Single Press Counter",
  then: function (newValue, devName, cellName) {
    dev["kitchen_light/enabled"] = !dev["kitchen_light/enabled"]
  }
});
 

defineRule({
  whenChanged: "wb-mcm8_30/Input 3 Long Press Counter",
  then: function (newValue, devName, cellName) {
    dev["kitchen_light/next"] = true
  }
});