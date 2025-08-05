


var enableToiletLight = defineLightControl("toilet_light", "Свет в туалете",
                  [
                    function(){
                      dev["wb-led_136/Channel 2"] = true
                      dev["wb-led_136/Channel 2 Brightness"] = 100
                      dev["wb-gpio/EXT2_K2"] = false
                    },
                    function(){
                      dev["wb-led_136/Channel 2"] = true
                      dev["wb-led_136/Channel 2 Brightness"] = 100
                      dev["wb-gpio/EXT2_K2"] = true
                    }
                  ], 
                  function(){
                      dev["wb-led_136/Channel 2"] = false
                      dev["wb-led_136/Channel 2 Brightness"] = 0
                      dev["wb-gpio/EXT2_K2"] = false
                  },
                  function(){
                      dev["wb-led_136/Channel 2"] = true
                      dev["wb-led_136/Channel 2 Brightness"] = 10
                      dev["wb-gpio/EXT2_K2"] = false
                    })

var toggle = definePresenceControl("wb-msw-v4_169/Current Motion",
                     100,
                     300000,
                     enableToiletLight)
