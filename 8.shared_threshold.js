function createDioxideThreshold(source, dest){
  var breezerDev = dest.split("/")[0]
  var thresholds = []

  function addThreshold(index, low, high, speed){
    var threshold = {
      index: index,
      title: "Бризер " + speed + " скорость",
      then: function(){
        dev[dest] = speed
      }
    }

    if (low !== null) {
      threshold.low = low
    }
    if (high !== null) {
      threshold.high = high
      threshold.highInclusive = false
    }
    thresholds.push(threshold)
  }

  function addThresholds(index, speeds){
    addThreshold(index, null, 550, speeds[0])
    addThreshold(index, 700, 800, speeds[1])
    addThreshold(index, 800, 900, speeds[2])
    addThreshold(index, 900, 1000, speeds[3])
    addThreshold(index, 1000, 1200, speeds[4])
    addThreshold(index, 1200, null, speeds[5])
  }

  addThresholds(0, [1, 2, 3, 4, 5, 6])
  addThresholds(1, [1, 2, 3, 4, 5, 5])
  addThresholds(2, [1, 2, 3, 4, 4, 4])

  return {
      dev: source,
      name: "CO2",
      title: "Порог CO2",
      initialIndex: {
        0: 0,
        1: 6,
        2: 12
      },
      invalidIndex: 0,
      invalidTitle: "Ошибка датчика: бризер 1 скорость",
      indexWhenChanged: "jls30h_14/Temperature",
      getIndex: function(currentIndex){
        var temperature = dev["jls30h_14/Temperature"]
        if (temperature === null || temperature === undefined ||
            temperature === "" || !isFinite(Number(temperature))) {
          return currentIndex === null ? 0 : currentIndex
        }

        temperature = Number(temperature)
        if (temperature >= 10) {
          return 0
        }
        if (temperature <= -10) {
          return 2
        }
        return 1
      },
      onIndexChange: function(oldIndex, newIndex){
        var heater = breezerDev + "/Heater"
        if (newIndex === 0) {
          if (dev[heater] !== false) {
            dev[heater] = false
          }
          return
        }

        var targetTemperatures = [0, 17, 10]
        dev[breezerDev + "/Target temperature"] = targetTemperatures[newIndex]
        if (dev[heater] !== true) {
          dev[heater] = true
        }
      },
      thresholds: thresholds
    }
}

global.__proto__.createDioxideThreshold = createDioxideThreshold

function createHeaterThreshold(source, dest){
  return {
      dev: source,
      name: "Heating",
      title: "Отопление",
      initialIndex: 2,
      invalidIndex: 2,
      invalidTitle: "Ошибка датчика: отопление выключено",
      thresholds: [
        {
          high: -5.0,
          title: "100%",
          then: function(){
            dev[dest] = 100
          }
        },
        {
          low: -5.0,
          lowInclusive: false,
          high: 0.0,
          title: "20%",
          then: function(){
            dev[dest] = 20
          }
        },
        {
          low: 0.0,
          lowInclusive: false,
          title: "Выключено",
          then: function(){
            dev[dest] = 0
          }
        }
      ]
    }
}
global.__proto__.createHeaterThreshold = createHeaterThreshold
