defineLightControl({
  name: "bathroom_light", 
  title: "Свет в душевой",
  states: [
      function(){
          dev["wb-led_136/Channel 3"] = false
          dev["wb-led_136/Channel 3 Brightness"] = 0
          dev["wb-gpio/EXT2_K1"] = false
      },
      function(){
          dev["wb-led_136/Channel 3"] = false
          dev["wb-led_136/Channel 3 Brightness"] = 0
          dev["wb-gpio/EXT2_K1"] = true
      },
      function(){
          dev["wb-led_136/Channel 3"] = false
          dev["wb-led_136/Channel 3 Brightness"] = 0
          dev["wb-gpio/EXT2_K1"] = true
      }
  ], 
  safe: function(){
      dev["wb-led_136/Channel 3"] = false
      dev["wb-led_136/Channel 3 Brightness"] = 0
      dev["wb-gpio/EXT2_K1"] = false
  }
})

defineSafetyGuard(
  function(){
    dev["wb-gpio/EXT3_K5"] = false
  },
  function(){
    dev["wb-gpio/EXT3_K5"] = true
  }
)

defineTimer({
  name: "bathroom_light_timer",
  title: "Таймер света в душе",
  timeout: 60000,
  active: function(state){
    if ( dev["bathroom_light/mode"] == 2){
      return
    }
    if ( state){
      dev["bathroom_light/mode"] = 1
    }else{
      dev["bathroom_light/mode"] = 0
    }
  }
})

defineRule({
  whenChanged: "wb-mcm8_1/Input 5",
  then: function(newValue){
    if( newValue){
      if (dev["bathroom_light/mode"] == 0){
        dev["bathroom_light/mode"] = 2
      }else{
        dev["bathroom_light/mode"] = 0
      }
    }
  }
})

defineRule({
  whenChanged: "bp/presence",
  then: function(newValue){
    if ( dev["bathroom_light/mode"] == 2){
      return
    }
    if(newValue === "false"){
      dev["bathroom_light_timer/activate"] = true
    }else{
      dev["bathroom_light/mode"] =1
      dev["bathroom_light_timer/cancel"] = true
    }
  }
})

defineThreshold({
  name: "bathroom_thresholds",
  title: "Пороги автоматизации в душе",
  points: [
    {
      dev: "wb-msw-v4_28/Humidity",
      name: "Humidity",
      title: "Порог влажности",
      initialIndex: 0,
      invalidIndex: 0,
      invalidTitle: "Ошибка датчика: вентиляция выключена",
      thresholds: [
        {
          high: 50,
          title: "Вентиляция выключена",
          then: function(){
            dev["wb-mr6cu_101/K6"] = false
          }
        },
        {
          low: 80,
          title: "Вентиляция включена",
          then: function(){
            dev["wb-mr6cu_101/K6"] = true
          }
        }
      ]
    }
  ]
})
