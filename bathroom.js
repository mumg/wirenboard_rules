defineLightControl("bathroom_light", "Свет в душевой",
                  [
                    function(){
                      dev["wb-led_136/Channel 3"] = true
                      dev["wb-led_136/Channel 3 Brightness"] = 100
                      dev["wb-gpio/EXT2_K1"] = false
                    },
                    function(){
                      dev["wb-led_136/Channel 3"] = true
                      dev["wb-led_136/Channel 3 Brightness"] = 100
                      dev["wb-gpio/EXT2_K1"] = true
                    }
                  ], 
                  function(){
                      dev["wb-led_136/Channel 3"] = false
                      dev["wb-led_136/Channel 3 Brightness"] = 0
                      dev["wb-gpio/EXT2_K1"] = false
                  },
                  function(){
                      dev["wb-led_136/Channel 3"] = true
                      dev["wb-led_136/Channel 3 Brightness"] = 10
                      dev["wb-gpio/EXT2_K1"] = false
                  })