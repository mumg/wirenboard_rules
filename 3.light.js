function defineLightControl(cfg) {
    // A state may be a function or { enabled: boolean, apply: function }.
    if (!cfg || !cfg.name || !cfg.states || cfg.states.length === 0) {
        log.error("defineLightControl: name and non-empty states are required")
        return
    }

    var storage = new PersistentStorage(cfg.name, {global: true})
    var enabledControl = cfg.name + "/enabled"
    var modeControl = cfg.name + "/mode"
    var nextControl = cfg.name + "/next"
    var changeControl = cfg.name + "/change"
    var safeControl = cfg.name + "/safe"

    var virtualDevice = {
        title: cfg.title || cfg.name,
        cells: {
            enabled: {
                type: "switch",
                title: "Включено",
                value: false,
                readonly: true
            }
        }
    }

    if (cfg.states.length > 1) {
        virtualDevice.cells.mode = {
            type: "value",
            title: "Режим",
            value: 0,
            readonly: false
        }
        virtualDevice.cells.next = {
            type: "pushbutton",
            title: "Следующий",
            value: false,
            readonly: false
        }
        virtualDevice.cells.change = {
            type: "value",
            title: "Изменить режим",
            value: 0,
            readonly: false
        }
    }

    if (cfg.safe) {
        virtualDevice.cells.safe = {
            type: "switch",
            title: "Безопасный режим",
            value: false,
            readonly: true
        }
    }

    defineVirtualDevice(cfg.name, virtualDevice)

    function normalizeMode(value) {
        var mode = Number(value)
        if (!isFinite(mode)) {
            return 0
        }

        mode = Math.round(mode)
        if (mode < 0 || mode >= cfg.states.length) {
            return 0
        }
        return mode
    }

    function getState(mode) {
        return cfg.states[mode]
    }

    function applyState(mode) {
        var state = getState(mode)
        if (typeof state === "function") {
            state()
        } else if (state && typeof state.apply === "function") {
            state.apply()
        } else {
            log.error(cfg.name + ": invalid light state " + mode)
        }
    }

    function isStateEnabled(mode) {
        var state = getState(mode)
        if (state && typeof state.enabled === "boolean") {
            return state.enabled
        }
        if (typeof cfg.enabled === "boolean") {
            return cfg.enabled
        }
        return mode !== 0
    }

    function isSafe() {
        return cfg.safe && dev[safeControl] === true
    }

    function setEnabled(enabled) {
        if (dev[enabledControl] !== enabled) {
            dev[enabledControl] = enabled
        }
    }

    function applyMode(mode) {
        storage.mode = mode

        if (isSafe()) {
            cfg.safe()
            setEnabled(false)
            return
        }

        applyState(mode)
        setEnabled(isStateEnabled(mode))
    }

    function requestMode(value) {
        if (cfg.states.length === 1) {
            applyMode(0)
            return
        }

        var mode = normalizeMode(value)
        if (dev[modeControl] !== mode) {
            dev[modeControl] = mode
        } else {
            applyMode(mode)
        }
    }

    function requestModeChange(delta) {
        var change = Number(delta)
        if (!isFinite(change)) {
            return
        }

        var mode = normalizeMode(dev[modeControl])
        mode = Math.round(mode + change)
        if (mode < 0) {
            mode = 0
        } else if (mode >= cfg.states.length) {
            mode = cfg.states.length - 1
        }
        requestMode(mode)
    }

    var initialMode = normalizeMode(storage.mode)

    if (cfg.states.length > 1) {
        dev[modeControl] = initialMode

        defineRule({
            whenChanged: modeControl,
            then: function (newValue, devName) {
                var mode = normalizeMode(newValue)
                log.info(devName + " = " + mode)

                if (newValue !== mode) {
                    dev[modeControl] = mode
                    return
                }
                applyMode(mode)
            }
        })

        defineRule({
            whenChanged: nextControl,
            then: function (newValue) {
                if (newValue !== true || isSafe()) {
                    return
                }

                var mode = normalizeMode(dev[modeControl]) + 1
                if (mode >= cfg.states.length) {
                    mode = 0
                }
                requestMode(mode)
            }
        })

        defineRule({
            whenChanged: changeControl,
            then: function (newValue) {
                if (newValue == 0) {
                    return
                }

                // Always reset the command, including while safety is active.
                dev[changeControl] = 0
                if (!isSafe()) {
                    requestModeChange(newValue)
                }
            }
        })
    }

    if (cfg.safe) {
        defineRule({
            whenChanged: safeControl,
            then: function () {
                applyMode(normalizeMode(dev[modeControl]))
            }
        })

        defineSafetyGuard(
            function () {
                dev[safeControl] = true
            },
            function () {
                dev[safeControl] = false
            }
        )
    }

    // Initial state must be applied explicitly because mode was set before its rule.
    applyMode(initialMode)

    return {
        apply: function () {
            applyMode(normalizeMode(dev[modeControl]))
        },
        setMode: requestMode
    }
}

global.__proto__.defineLightControl = defineLightControl
