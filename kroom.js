defineLightControl({
  name: "kroom_light", 
  title: "Свет в комнате Кристины",
  states: [
    function(){
      dev["wb-gpio/EXT1_K6"] = true
    }
  ], 
  safe: function(){
    dev["wb-gpio/EXT1_K6"] = false
  },
  idle: function(){
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