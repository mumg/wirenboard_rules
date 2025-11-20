defineLightControl({
  name: "wardrobe_light",
  title: "Свет в гардеробе",
  states: [ 
    function(){
      dev["wb-gpio/EXT1_K2"] = false
    },
    function(){
      dev["wb-gpio/EXT1_K2"] = true
    }
  ],
  safe: function(){
      dev["wb-gpio/EXT1_K2"] = false
  }
});

defineRule({
  whenChanged: "wb-mcm8_227/Input 2 Single Press Counter",
    then: function(){
    dev["wardrobe_light/next"] = true
  }
});
