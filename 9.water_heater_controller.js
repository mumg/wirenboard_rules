function defineWaterHeater(cfg) {
    var enabledControl = cfg.name + "/enabled"
    var stateControl = cfg.name + "/state"
    var safetyControl = cfg.safetyControl || "safety/enabled"
    var moveTimeout = cfg.moveTimeout || 15000

    defineVirtualDevice(cfg.name, {
        title: cfg.title || cfg.name,
        cells: {
            state: {
                title: "Состояние",
                type: "text",
                value: "Инициализация",
                readonly: true
            },
            enabled: {
                title: "Включен",
                type: "switch",
                value: false
            }
        }
    })

    var storage = new PersistentStorage(cfg.name, {global: true})
    dev[enabledControl] = storage.enabled === true

    function setOutput(name, value) {
        if (name !== undefined && dev[name] !== value) {
            dev[name] = value
        }
    }

    function setActuator(attached) {
        // Remove power from the opposite direction before switching direction.
        if (attached) {
            setOutput(cfg.detachOutput, false)
            setOutput(cfg.attachOutput, true)
        } else {
            setOutput(cfg.attachOutput, false)
            setOutput(cfg.detachOutput, true)
        }
    }

    function setHeatingElement(enabled) {
        setOutput(cfg.heatingElementOutput, enabled)
    }

    function syncSafetyOutput() {
        setOutput(cfg.safetyOutput, dev[safetyControl] !== true)
    }

    function readPosition(sm) {
        if (dev[cfg.mainOutput] === true) {
            sm.context.mainOpen = true
        } else if (dev[cfg.mainOutput] === false) {
            sm.context.mainOpen = false
        } else {
            sm.context.mainOpen = null
        }

        if (dev[cfg.attachOutput] === true &&
            dev[cfg.detachOutput] === false) {
            sm.context.heaterAttached = true
        } else if (dev[cfg.attachOutput] === false &&
                   dev[cfg.detachOutput] === true) {
            sm.context.heaterAttached = false
        } else {
            sm.context.heaterAttached = null
        }
    }

    function route(sm) {
        // SAFE: the main line is closed and the heater is detached.
        if (dev[safetyControl] === true) {
            if (sm.context.mainOpen !== false) {
                sm.change(sm, "close_main")
            } else if (sm.context.heaterAttached !== false) {
                sm.change(sm, "detach_heater")
            } else {
                sm.change(sm, "safe")
            }
            return
        }

        // HEATER: the main line is closed and the heater is attached.
        if (dev[enabledControl] === true) {
            if (sm.context.mainOpen !== false) {
                sm.change(sm, "close_main")
            } else if (sm.context.heaterAttached !== true) {
                sm.change(sm, "attach_heater")
            } else {
                sm.change(sm, "heater_on")
            }
            return
        }

        // MAIN: the heater is detached and the main line is open.
        if (sm.context.heaterAttached !== false) {
            sm.change(sm, "detach_heater")
        } else if (sm.context.mainOpen !== true) {
            sm.change(sm, "open_main")
        } else {
            sm.change(sm, "main_on")
        }
    }

    var sm = createSM(
        {
            // null means movement is in progress and the position is not confirmed.
            mainOpen: null,
            heaterAttached: null
        },
        {
            init: {
                enter: function (sm) {
                    readPosition(sm)
                    route(sm)
                }
            },

            close_main: {
                enter: function (sm) {
                    log.info(cfg.name + ": close_main enter")
                    setHeatingElement(false)
                    sm.context.mainOpen = null
                    dev[stateControl] = "Выключаем магистраль"
                    setOutput(cfg.mainOutput, false)
                    sm.startTimer(sm, "complete", moveTimeout)
                },
                complete: function (sm) {
                    sm.context.mainOpen = false
                    route(sm)
                }
            },

            attach_heater: {
                enter: function (sm) {
                    log.info(cfg.name + ": attach_heater enter")
                    setHeatingElement(false)
                    sm.context.heaterAttached = null
                    dev[stateControl] = "Подключаем нагреватель"
                    setActuator(true)
                    sm.startTimer(sm, "complete", moveTimeout)
                },
                complete: function (sm) {
                    sm.context.heaterAttached = true
                    route(sm)
                },
                enabled: function (sm, evt, enabled) {
                    if (enabled === false) {
                        sm.change(sm, "detach_heater")
                    }
                },
                safety: function (sm, evt, safety) {
                    if (safety === true) {
                        sm.change(sm, "detach_heater")
                    }
                }
            },

            heater_on: {
                enter: function () {
                    log.info(cfg.name + ": heater_on enter")
                    setHeatingElement(true)
                    dev[stateControl] = "Включен"
                },
                enabled: function (sm, evt, enabled) {
                    if (enabled === false) {
                        sm.change(sm, "detach_heater")
                    }
                },
                safety: function (sm, evt, safety) {
                    if (safety === true) {
                        sm.change(sm, "detach_heater")
                    }
                }
            },

            detach_heater: {
                enter: function (sm) {
                    log.info(cfg.name + ": detach_heater enter")
                    setHeatingElement(false)
                    sm.context.heaterAttached = null
                    dev[stateControl] = "Отключаем нагреватель"
                    setActuator(false)
                    sm.startTimer(sm, "complete", moveTimeout)
                },
                complete: function (sm) {
                    sm.context.heaterAttached = false
                    route(sm)
                },
                enabled: function (sm, evt, enabled) {
                    if (enabled === true && dev[safetyControl] !== true) {
                        if (sm.context.mainOpen === false) {
                            sm.change(sm, "attach_heater")
                        } else {
                            sm.change(sm, "close_main")
                        }
                    }
                },
                safety: function (sm, evt, safety) {
                    if (safety === true && sm.context.mainOpen !== false) {
                        sm.change(sm, "close_main")
                    }
                }
            },

            open_main: {
                enter: function (sm) {
                    log.info(cfg.name + ": open_main enter")
                    setHeatingElement(false)
                    sm.context.mainOpen = null
                    dev[stateControl] = "Включаем магистраль"
                    setOutput(cfg.mainOutput, true)
                    sm.startTimer(sm, "complete", moveTimeout)
                },
                complete: function (sm) {
                    sm.context.mainOpen = true
                    route(sm)
                },
                enabled: function (sm, evt, enabled) {
                    if (enabled === true) {
                        sm.change(sm, "close_main")
                    }
                },
                safety: function (sm, evt, safety) {
                    if (safety === true) {
                        sm.change(sm, "close_main")
                    }
                }
            },

            main_on: {
                enter: function () {
                    log.info(cfg.name + ": main_on enter")
                    setHeatingElement(false)
                    dev[stateControl] = "Выключен"
                },
                enabled: function (sm, evt, enabled) {
                    if (enabled === true) {
                        sm.change(sm, "close_main")
                    }
                },
                safety: function (sm, evt, safety) {
                    if (safety === true) {
                        sm.change(sm, "close_main")
                    }
                }
            },

            safe: {
                enter: function () {
                    log.info(cfg.name + ": safe enter")
                    setHeatingElement(false)
                    dev[stateControl] = "Безопасный режим"
                },
                safety: function (sm, evt, safety) {
                    if (safety === false) {
                        route(sm)
                    }
                }
            }
        },
        "init"
    )

    // Secondary software interlock for manual changes outside this controller.
    defineRule({
        whenChanged: cfg.attachOutput,
        then: function (newValue) {
            if (newValue === true) {
                setOutput(cfg.detachOutput, false)
            }
        }
    })

    defineRule({
        whenChanged: cfg.detachOutput,
        then: function (newValue) {
            if (newValue === true) {
                setOutput(cfg.attachOutput, false)
            }
        }
    })

    defineRule({
        whenChanged: enabledControl,
        then: function (newValue) {
            storage.enabled = newValue === true
            log.info(enabledControl + " " + newValue)
            sm.handle(sm, "enabled", newValue)
        }
    })

    defineRule({
        whenChanged: safetyControl,
        then: function (newValue) {
            log.info(safetyControl + " " + newValue)
            syncSafetyOutput()
            sm.handle(sm, "safety", newValue)
        }
    })

    syncSafetyOutput()
    return sm
}

global.__proto__.defineWaterHeater = defineWaterHeater
