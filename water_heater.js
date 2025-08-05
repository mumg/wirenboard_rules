defineRule({
    whenChanged: "wb-mr6cu_101/K1",
    then: function (newValue, devName, cellName) {
        if (newValue) {
            dev["wb-mr6cu_101/K2"] = false
        }
    }
});

defineRule({
    whenChanged: "wb-mr6cu_101/K2",
    then: function (newValue, devName, cellName) {
        if (newValue) {
            dev["wb-mr6cu_101/K1"] = false
        }
    }
});

defineVirtualDevice("water_heater", {
    title: "Водонагреватель",
    cells: {
        state: {
            title: "Состояние",
            type: "text",
            value: "Выключен",
            readonly: true
        },
        enabled: {
            title: "Включен",
            type: "switch",
            value: false
        }
    }
});

var ps = new PersistentStorage("water_heater", {global: true});

dev["water_heater/enabled"] = ps.enabled || false;

defineRule({
    whenChanged: "water_heater/enabled",
    then: function (newValue, devName, cellName) {
        ps.enabled = newValue
    }
});



var water_heater_sm = createSM(
        {
        },
        {
            init: {
                enter: function (sm) {
                    if (dev["water_heater/enabled"]  == true) {
                        sm.change(sm, "turn_off_hot_water")
                    } else {
                        sm.change(sm, "turn_off_heater")
                    }
                },
                exit: function (sm) {
                    log.info("water_heater: init exit");
                }
            },
            turn_off_hot_water: {
                enter: function (sm) {
                    log.info("water_heater: turn_off_hot_water enter");
                    if (dev["wb-mwac-v2_81/Output K1"] == true) {
                        dev["water_heater/state"] = "Выключаем магистраль"
                        sm.startTimer(sm, "complete", 15000)
                        dev["wb-mwac-v2_81/Output K1"] = false
                    } else {
                        if(dev["safety/enabled"] == true){
                            sm.change(sm, "complete_off")
                        }else{
                            sm.change(sm, "attach_heater")
                        }

                    }
                },
                complete: function (sm) {
                    log.info("water_heater: turn_off_hot_water complete")
                    if (dev["safety/enabled"] == true) {
                        sm.change(sm, "complete_off")
                    } else if (dev["water_heater/enabled"] == false) {
                        sm.change(sm, "turn_on_hot_water")
                    } else {
                        sm.change(sm, "attach_heater")
                    }
                },
                exit: function (sm) {
                    log.info("water_heater: turn_off_hot_water exit")
                }
            },
            attach_heater: {
                enter: function (sm) {
                    log.info("water_heater: attach_heater enter")
                    dev["water_heater/state"] = "Подклюбчаем нагреватель"
                    sm.startTimer(sm, "complete", 15000)
                    dev["wb-mr6cu_101/K2"] = true
                },
                exit: function (sm) {
                    log.info("water_heater: attach_heater exit")
                },
                complete: function (sm) {
                    log.info("water_heater: attach_heater complete")
                    if (dev["safety/enabled"] == true) {
                        sm.change(sm, "detach_heater")
                    } else if (dev["water_heater/enabled"] == false) {
                        sm.change(sm, "detach_heater")
                    } else {
                        sm.change(sm, "turn_on_heater")
                    }
                }
            },
            turn_on_heater: {
                enter: function (sm) {
                    log.info("water_heater: turn_on_heater enter")
                    sm.change(sm, "on")
                },
                exit: function (sm) {
                    log.info("water_heater: turn_on_heater exit")
                }
            },
            on: {
                enter: function (sm) {
                    log.info("water_heater: on enter")
                    dev["water_heater/state"] = "Включен"
                },
                exit: function (sm) {
                    log.info("water_heater: on exit")
                },
                enabled: function (sm, evt, state) {
                    log.info("water_heater: on enabled changed to: " + state)
                    if (state == false) {
                        sm.change(sm, "turn_off_heater")
                    }
                },
                safety: function (sm, evt, state) {
                    log.info("water_heater: on safety changed to: " + state)
                    if (state == true) {
                        sm.change(sm, "turn_off_heater")
                    }
                }
            },
            turn_off_heater: {
                enter: function (sm) {
                    log.info("water_heater: turn_off_heater enter")
                    sm.change(sm, "detach_heater")
                },
                exit: function (sm) {
                    log.info("water_heater: turn_off_heater exit")
                }
            },
            detach_heater: {
                enter: function (sm) {
                    log.info("water_heater: detach_heater enter")
                    dev["wb-mr6cu_101/K1"] = true
                    dev["water_heater/state"] = "Отключаем нагреватель"
                    sm.startTimer(sm, "complete", 15000)
                },
                exit: function (sm) {
                    log.info("water_heater: detach_heater exit")
                },
                complete: function (sm) {
                    log.info("water_heater: detach_heater complete")
                    if (dev["safety/enabled"] == true) {
                        sm.change(sm, "complete_off")
                    } else if (dev["water_heater/enabled"] == true) {
                        sm.change(sm, "attach_heater")
                    } else {
                        sm.change(sm, "turn_on_hot_water")
                    }
                }
            },
            turn_on_hot_water: {
                enter: function (sm) {
                    log.info("water_heater: turn_on_hot_water enter");
                    if (dev["wb-mwac-v2_81/Output K1"] == false) {
                        dev["water_heater/state"] = "Включаем магистраль"
                        sm.startTimer(sm, "complete", 15000)
                        dev["wb-mwac-v2_81/Output K1"] = true
                    } else {
                        sm.change(sm, "off")
                    }
                },
                complete: function (sm) {
                    log.info("water_heater: turn_on_hot_water complete")
                    if (dev["safety/enabled"] == true) {
                        sm.change(sm, "complete_off")
                    } else if (dev["water_heater/enabled"] == false) {
                        sm.change(sm, "off")
                    } else {
                        sm.change(sm, "attach_heater")
                    }
                },
                exit: function (sm) {
                    log.info("water_heater: turn_on_hot_water exit")
                }
            },
            off: {
                enter: function (sm) {
                    log.info("water_heater: off enter")
                    dev["water_heater/state"] = "Выключен"
                },
                exit: function (sm) {
                    log.info("water_heater: off exit")
                },
                enabled: function (sm, evt, state) {
                    log.info("water_heater: off enabled changed to: " + state)
                    if (state == true) {
                        sm.change(sm, "turn_off_hot_water")
                    }
                },
                safety: function (sm, evt, state) {
                    log.info("water_heater: off safety changed to: " + state)
                    if (state == true) {
                        sm.change(sm, "turn_off_hot_water")
                    }
                }
            },
            complete_off: {
                enter: function (sm) {
                    log.info("water_heater: complete_off enter")
                    dev["water_heater/state"] = "Безопасный режим"
                },
                exit: function (sm) {
                    log.info("water_heater: complete_off exit")
                },
                safety: function (sm, evt, state) {
                    log.info("water_heater: complete_off safety changed to: " + state)
                    if (state == false) {
                        sm.change(sm, "turn_off_hot_water")
                    }
                }
            }
        },
        "init"
    )
;

defineRule({
    whenChanged: "water_heater/enabled",
    then: function (newValue, devName, cellName) {
        log.info("water_heater/enabled " + newValue)
        water_heater_sm.handle(water_heater_sm, "enabled", newValue)
    }
});

defineRule({
    whenChanged: "safety/enabled",
    then: function (newValue, devName, cellName) {
      log.info("safety/enabled " + newValue)
       water_heater_sm.handle(water_heater_sm, "safety", newValue)
       if (newValue == true){
         dev["wb-mwac-v2_81/Output K2"] = false
       }else{
         dev["wb-mwac-v2_81/Output K2"] = true
       }
    }
});