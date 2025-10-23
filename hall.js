defineLightControl({
  name: "bookshelf_left",
  title: "Свет в книжном шкафу левая",
  states: [    
    function(){
      dev["wb-led_30/Channel 1"] = true
      dev["wb-led_30/Channel 1 Brightness"] = 100
    }
  ],
  safe: function(){
      dev["wb-led_30/Channel 1"] = false
  },
  idle: function(){
      dev["wb-led_30/Channel 1"] = true
      dev["wb-led_30/Channel 1 Brightness"] = 20
  }
});

defineLightControl({
  name: "bookshelf_right",
  title: "Свет в книжном шкафу правая",
  states: [    
    function(){
      dev["wb-led_30/Channel 2"] = true
      dev["wb-led_30/Channel 2 Brightness"] = 100
    }
  ],
  safe: function(){
      dev["wb-led_30/Channel 2"] = false
  },
  idle: function(){
      dev["wb-led_30/Channel 2"] = true
      dev["wb-led_30/Channel 2 Brightness"] = 20
  }
});

defineRule({
  whenChanged: ["wb-m1w2_104/Input 1", "wb-m1w2_104/Input 2"],
  then: function(){
    dev["bookshelf_left/enabled"] = !(dev["wb-m1w2_104/Input 1"] && dev["wb-m1w2_104/Input 2"])
  }
})

defineRule({
  whenChanged: ["wb-m1w2_103/Input 1", "wb-m1w2_103/Input 2"],
  then: function(){
    dev["bookshelf_right/enabled"] = !(dev["wb-m1w2_103/Input 1"] && dev["wb-m1w2_103/Input 2"])
  }
})

defineLightControl({
  name: "hall_light",
  title: "Свет в коридоре",
  states: [    
    function(){
      dev["wb-gpio/EXT2_K7"] = true
      dev["wb-led_136/Channel 1"] = false
      dev["wb-led_136/Channel 1 Brightness"] = 0
    }
  ],
  safe: function(){
      dev["wb-gpio/EXT2_K7"] = false
      dev["wb-led_136/Channel 1"] = false
      dev["wb-led_136/Channel 1 Brightness"] = 0
  },
  idle: function(){
      dev["wb-gpio/EXT2_K7"] = false
      dev["wb-led_136/Channel 1"] = true
      dev["wb-led_136/Channel 1 Brightness"] = 20
  }
});

defineLightControl({
  name: "hall_bra",
  title: "Подсветка зеркала в коридоре",
  states: [    
    function(){
      dev["wb-gpio/EXT1_K5"] = true
    }
  ],
  safe: function(){
      dev["wb-gpio/EXT1_K5"] = false
  },
  idle: function(){
      dev["wb-gpio/EXT1_K5"] = false
  }
});

defineRule({
  whenChanged: "wb-mcm8_30/Input 1 Single Press Counter",
  then: function(){
    dev["hall_bra/enabled"] = !dev["hall_bra/enabled"]
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
  whenChanged: "wb-mcm8_30/Input 4 Single Press Counter",
  then: function(){
    dev["hall_light/enabled"] = !dev["hall_light/enabled"]
  }
})

defineRule({
  whenChanged: "wb-mcm8_30/Input 4 Long Press Counter",
  then: function(){
    dev["hall_light/next"] = true
  }
})

defineRule({
  whenChanged: ["wb-mcm8_1/Input 2", "wb-mcm8_227/Input 1"],
  then: function(newValue){
    if( newValue){
      dev["hall_light/enabled"] = !dev["hall_light/enabled"]
    }
  }
})
