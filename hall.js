defineLightControl("hall_light",
                   "Свет в коридоре",
  [    
    function(){
      dev["wb-gpio/EXT2_K7"] = true
    }
  ],
  function(){
      dev["wb-gpio/EXT2_K7"] = false
  },
  function(){
      dev["wb-gpio/EXT2_K7"] = false
  });

defineLightControl("hall_bra",
                   "Подсветка зеркала в коридоре",
  [    
    function(){
      dev["wb-gpio/EXT1_K5"] = true
    }
  ],
  function(){
      dev["wb-gpio/EXT1_K5"] = false
  },
  function(){
      dev["wb-gpio/EXT1_K5"] = false
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
