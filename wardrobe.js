defineLightControl("wardrobe_light",
                   "Свет в гардеробе",
  [    
    function(){
      dev["wb-gpio/EXT1_K2"] = true
    }
  ],
  function(){
      dev["wb-gpio/EXT1_K2"] = false
  },
  function(){
      dev["wb-gpio/EXT1_K2"] = false
  });