defineLightControl("bedroom_light",
                   "Свет в спальне",
  [    
    function(){
      dev["wb-gpio/EXT1_K4"] = true
    }
  ],
  function(){
      dev["wb-gpio/EXT1_K4"] = false
  },
  function(){
      dev["wb-gpio/EXT1_K4"] = false
  });