var pulsate_buzzer = undefined;

defineVirtualDevice("alarm", {
    title: "Звук тревоги",
    cells: {
      enabled: {
        type: "switch",
        readonly: false,
        title: "Включен",
        value: false
      }
    }
})

defineRule({
  whenChanged: "alarm/enabled",
  then: function(newValue){
    if(newValue){
      if ( pulsate_buzzer != undefined ){
        pulsate_buzzer.cancel()
        pulsate_buzzer = undefined
      }
      pulsate_buzzer = pulsate(["wb-msw-v4_75/Buzzer",
                                "wb-msw-v4_80/Buzzer",
                               "wb-msw-v4_36/Buzzer",
                               "wb-msw-v4_169/Buzzer",
                               "wb-msw-v4_28/Buzzer"], 1)
            log.info(JSON.stringify(pulsate_buzzer))
    }else{
      if ( pulsate_buzzer != undefined ){
        pulsate_buzzer.cancel()
        pulsate_buzzer = undefined
      }
    }
  }
})