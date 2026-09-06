function createThresholdPoint(deviceName, point) {
    var controlName = deviceName + "/" + point.name
    var currentIndex = null
    var currentSelectionIndex = null

    function isNumber(value) {
        if (value === null || value === undefined || value === "" ||
            typeof value === "boolean" ||
            (typeof value === "string" && /^\s*$/.test(value))) {
            return false
        }
        return isFinite(Number(value))
    }

    function includesValue(threshold, value) {
        var lowMatches = true
        var highMatches = true

        if (threshold.low !== undefined) {
            lowMatches = threshold.lowInclusive === false ?
                value > threshold.low : value >= threshold.low
        }
        if (threshold.high !== undefined) {
            highMatches = threshold.highInclusive === false ?
                value < threshold.high : value <= threshold.high
        }
        return lowMatches && highMatches
    }

    function normalizeSelectionIndex(value) {
        if (!isNumber(value)) {
            return null
        }

        var index = Number(value)
        if (index < 0 || Math.floor(index) !== index) {
            return null
        }
        return index
    }

    function getThresholdSelectionIndex(threshold) {
        if (threshold.index === undefined) {
            return 0
        }
        return normalizeSelectionIndex(threshold.index)
    }

    function resolveSelectionIndex() {
        if (typeof point.getIndex !== "function") {
            return 0
        }

        var index = normalizeSelectionIndex(point.getIndex(currentSelectionIndex))
        if (index === null) {
            log.error(deviceName + "/" + point.name + ": getIndex returned invalid index")
            return 0
        }
        return index
    }

    function isUsableThreshold(threshold) {
        return threshold &&
               typeof threshold.then === "function" &&
               getThresholdSelectionIndex(threshold) !== null &&
               (threshold.low === undefined || isNumber(threshold.low)) &&
               (threshold.high === undefined || isNumber(threshold.high)) &&
               !(threshold.low !== undefined &&
                 threshold.high !== undefined &&
                 Number(threshold.low) > Number(threshold.high))
    }

    function lookupThreshold(value, selectionIndex) {
        for (var index = 0; index < point.thresholds.length; index++) {
            if (isUsableThreshold(point.thresholds[index]) &&
                getThresholdSelectionIndex(point.thresholds[index]) === selectionIndex &&
                includesValue(point.thresholds[index], value)) {
                return index
            }
        }
        return -1
    }

    function getThresholdTitle(index) {
        var threshold = point.thresholds[index]
        return threshold.title !== undefined ? threshold.title : index.toString()
    }

    function isValidIndex(index) {
        return typeof index === "number" &&
               index >= 0 &&
               index < point.thresholds.length
    }

    function getInitialThresholdIndex(selectionIndex) {
        if (point.initialIndex && typeof point.initialIndex === "object") {
            return point.initialIndex[selectionIndex]
        }
        return point.initialIndex
    }

    function applyIndex(index, value, force, title) {
        if (!isValidIndex(index)) {
            log.error(deviceName + "/" + point.name + ": invalid threshold index " + index)
            return false
        }

        var threshold = point.thresholds[index]
        if (!isUsableThreshold(threshold)) {
            log.error(deviceName + "/" + point.name + ": threshold " + index + " is invalid")
            return false
        }

        var changed = currentIndex !== index
        currentIndex = index
        if (changed || force === true) {
            threshold.then(value, point, index)
        }

        dev[controlName] = title !== undefined ? title : getThresholdTitle(index)
        return true
    }

    function applyInvalid(value, reason) {
        var title = point.invalidTitle || "Ошибка датчика"
        if (isValidIndex(point.invalidIndex)) {
            applyIndex(point.invalidIndex, value, true, title)
        } else {
            dev[controlName] = title
        }
        log.error(deviceName + "/" + point.name + ": " + reason)
    }

    function evaluate(rawValue, force) {
        var newSelectionIndex = resolveSelectionIndex()
        if (currentSelectionIndex !== newSelectionIndex) {
            var oldSelectionIndex = currentSelectionIndex
            currentSelectionIndex = newSelectionIndex
            if (typeof point.onIndexChange === "function") {
                point.onIndexChange(oldSelectionIndex, newSelectionIndex)
            }
        }

        if (!isNumber(rawValue)) {
            applyInvalid(rawValue, "invalid sensor value " + rawValue)
            return
        }

        var value = Number(rawValue)

        var newIndex = lookupThreshold(value, currentSelectionIndex)
        if (newIndex >= 0) {
            applyIndex(newIndex, value, force === true)
            return
        }

        // A gap between thresholds is a hysteresis zone. Keep the last state.
        if (currentIndex !== null &&
            getThresholdSelectionIndex(point.thresholds[currentIndex]) === currentSelectionIndex) {
            dev[controlName] = getThresholdTitle(currentIndex)
            return
        }

        var initialIndex = getInitialThresholdIndex(currentSelectionIndex)
        if (isValidIndex(initialIndex) &&
            getThresholdSelectionIndex(point.thresholds[initialIndex]) === currentSelectionIndex) {
            applyIndex(initialIndex, value, true)
        } else {
            dev[controlName] = point.noMatchTitle || "Нет подходящего диапазона"
            log.error(
                deviceName + "/" + point.name +
                ": no initial threshold for " + value +
                " at index " + currentSelectionIndex
            )
        }
    }

    function validateThresholds() {
        for (var index = 0; index < point.thresholds.length; index++) {
            var threshold = point.thresholds[index]
            if (!isUsableThreshold(threshold)) {
                log.error(deviceName + "/" + point.name + ": threshold " + index + " is invalid")
                continue
            }

            for (var otherIndex = index + 1;
                 otherIndex < point.thresholds.length;
                otherIndex++) {
                var other = point.thresholds[otherIndex]
                if (!isUsableThreshold(other)) {
                    continue
                }
                if (getThresholdSelectionIndex(threshold) !==
                    getThresholdSelectionIndex(other)) {
                    continue
                }
                var low = Math.max(
                    threshold.low === undefined ? -Infinity : Number(threshold.low),
                    other.low === undefined ? -Infinity : Number(other.low)
                )
                var high = Math.min(
                    threshold.high === undefined ? Infinity : Number(threshold.high),
                    other.high === undefined ? Infinity : Number(other.high)
                )

                if (low < high ||
                    (low === high &&
                     includesValue(threshold, low) &&
                     includesValue(other, low))) {
                    log.error(
                        deviceName + "/" + point.name +
                        ": thresholds " + index + " and " + otherIndex +
                        " overlap at index " + getThresholdSelectionIndex(threshold)
                    )
                }
            }
        }
    }

    if (point.getIndex !== undefined && typeof point.getIndex !== "function") {
        log.error(deviceName + "/" + point.name + ": getIndex must be a function")
    }
    if (point.onIndexChange !== undefined && typeof point.onIndexChange !== "function") {
        log.error(deviceName + "/" + point.name + ": onIndexChange must be a function")
    }

    validateThresholds()

    defineRule({
        whenChanged: point.dev,
        then: function (newValue) {
            evaluate(newValue, false)
        }
    })

    if ((typeof point.indexWhenChanged === "string" &&
         point.indexWhenChanged.length > 0) ||
        (Array.isArray(point.indexWhenChanged) &&
         point.indexWhenChanged.length > 0)) {
        defineRule({
            whenChanged: point.indexWhenChanged,
            then: function () {
                evaluate(dev[point.dev], false)
            }
        })
    } else if (point.indexWhenChanged !== undefined) {
        log.error(deviceName + "/" + point.name + ": indexWhenChanged must not be empty")
    }

    evaluate(dev[point.dev], true)

    return {
        evaluate: function () {
            evaluate(dev[point.dev], true)
        },
        getIndex: function () {
            return currentIndex
        },
        getSelectionIndex: function () {
            return currentSelectionIndex
        }
    }
}

function defineThreshold(cfg) {
    if (!cfg || !cfg.name || !cfg.points || cfg.points.length === 0) {
        log.error("defineThreshold: name and non-empty points are required")
        return
    }

    var cells = {}
    var pointNames = {}

    for (var index = 0; index < cfg.points.length; index++) {
        var point = cfg.points[index]
        if (!point || !point.name || !point.dev ||
            !point.thresholds || point.thresholds.length === 0) {
            log.error(cfg.name + ": invalid threshold point " + index)
            continue
        }
        if (pointNames[point.name]) {
            log.error(cfg.name + ": duplicate threshold point " + point.name)
            continue
        }

        pointNames[point.name] = true
        cells[point.name] = {
            title: point.title || point.name,
            readonly: true,
            type: "text",
            value: "Инициализация"
        }
    }

    defineVirtualDevice(cfg.name, {
        title: cfg.title || cfg.name,
        cells: cells
    })

    var controllers = {}
    for (var pointIndex = 0; pointIndex < cfg.points.length; pointIndex++) {
        var thresholdPoint = cfg.points[pointIndex]
        if (thresholdPoint && cells[thresholdPoint.name] && !controllers[thresholdPoint.name]) {
            controllers[thresholdPoint.name] = createThresholdPoint(
                cfg.name,
                thresholdPoint
            )
        }
    }

    return {
        points: controllers,
        evaluate: function () {
            for (var name in controllers) {
                if (controllers.hasOwnProperty(name)) {
                    controllers[name].evaluate()
                }
            }
        }
    }
}

global.__proto__.defineThreshold = defineThreshold
