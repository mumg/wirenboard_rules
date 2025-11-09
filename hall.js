defineLightControl({
  name: "bookshelf_left",
  title: "Свет в книжном шкафу левая",
  states: [
    function(){
      dev["wb-led_30/Channel 1"] = true
      dev["wb-led_30/Channel 1 Brightness"] = 20
    },
    function(){
      dev["wb-led_30/Channel 1"] = true
      dev["wb-led_30/Channel 1 Brightness"] = 100
    }
  ],
  safe: function(){
      dev["wb-led_30/Channel 1"] = false
  }
});

defineLightControl({
  name: "bookshelf_right",
  title: "Свет в книжном шкафу правая",
  states: [    
    function(){
      dev["wb-led_30/Channel 2"] = true
      dev["wb-led_30/Channel 2 Brightness"] = 20
    },
    function(){
      dev["wb-led_30/Channel 2"] = true
      dev["wb-led_30/Channel 2 Brightness"] = 100
    }
  ],
  safe: function(){
      dev["wb-led_30/Channel 2"] = false
  }
});


defineRule({
  whenChanged: ["wb-m1w2_104/Input 1", "wb-m1w2_104/Input 2"],
  then: function(){
    log.info("left " + (dev["wb-m1w2_104/Input 1"] && dev["wb-m1w2_104/Input 2"]))
    if( !(dev["wb-m1w2_104/Input 1"] && dev["wb-m1w2_104/Input 2"])){
      dev["bookshelf_left/mode"] = 1
    }else{
      dev["bookshelf_left/mode"] = 0
    }
  }
})

defineRule({
  whenChanged: ["wb-m1w2_103/Input 1", "wb-m1w2_103/Input 2"],
  then: function(){
    log.info("right " + (dev["wb-m1w2_103/Input 1"] && dev["wb-m1w2_103/Input 2"]))
    if(!(dev["wb-m1w2_103/Input 1"] && dev["wb-m1w2_103/Input 2"]) ){
          dev["bookshelf_right/mode"] = 1
    }else{
          dev["bookshelf_right/mode"] = 0
    }

  }
})

defineLightControl({
  name: "hall_light",
  title: "Свет в коридоре",
  states: [
    function(){
      dev["wb-gpio/EXT2_K7"] = false
      dev["wb-led_136/Channel 1"] = true
      dev["wb-led_136/Channel 1 Brightness"] = 5
    },
    function(){
      dev["wb-gpio/EXT2_K7"] = true
      dev["wb-led_136/Channel 1"] = false
      dev["wb-led_136/Channel 1 Brightness"] = 0
    }
  ],
  safe: function(){
      dev["wb-gpio/EXT2_K7"] = false
      dev["wb-led_136/Channel 1"] = true
      dev["wb-led_136/Channel 1 Brightness"] = 10
  }
});

defineLightControl({
  name: "hall_bra",
  title: "Подсветка зеркала в коридоре",
  states: [
    function(){
      dev["wb-gpio/EXT1_K5"] = false
    },
    function(){
      dev["wb-gpio/EXT1_K5"] = true
    }
  ],
  safe: function(){
      dev["wb-gpio/EXT1_K5"] = false
  }
});

defineRule({
  whenChanged: "wb-mcm8_30/Input 1 Single Press Counter",
  then: function(){
    dev["hall_bra/next"] = true
  }
})


defineRule({
  whenChanged: "wb-mcm8_30/Input 5 Long Press Counter",
  then: function(){
    dev["safety/enabled"] = true
  }
})

defineRule({
  whenChanged: "wb-mcm8_30/Input 5 Single Press Counter",
  then: function(){
    if (dev["safety/enabled"]){
      dev["safety/enabled"] = false
    }
  }
})


defineRule({
  whenChanged: ["wb-mcm8_1/Input 2", "wb-mcm8_227/Input 1", "wb-mcm8_30/Input 4"],
  then: function(newValue){
    if( newValue){
      dev["hall_light/next"] = true
    }
  }
})

defineAlarm({
  name: "entrance_door_opened",
  title: "Входная дверь открыта",
  timeout: 30
})


defineRule({
  whenChanged: ["entrance door sensor/contact"],
  then: function(newValue){
    if(newValue == "false"){
      dev["entrance_door_opened/active"] = true
    }
  }
})

