defineRule({
  whenChanged: ["kitchen_detector/smoke",
                "hall_detector/smoke",
                "nikita_detector/smoke",
                "kristina_detector/smoke",
                "bedroom_detector/smoke"],
  then: function(newState){
    if(newState === "true"){
      
    }
  }
})