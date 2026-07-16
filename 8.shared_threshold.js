function createDioxideThreshold(source, dest){
  return {
      dev: source,
      name: "CO2",
      title: "Порог CO2",
      initialIndex: 0,
      invalidIndex: 0,
      invalidTitle: "Ошибка датчика: бризер 1 скорость",
      thresholds: [
        {
          high: 550,
          highInclusive: false,
          title: "Бризер 1 скорость",
          then: function(){
            dev[dest] = 1
          }
        },
        {
          low: 700,
          high: 800,
          highInclusive: false,
          title: "Бризер 2 скорость",
          then: function(){
            dev[dest] = 2
          }
        },
        {
          low: 800,
          high: 900,
          highInclusive: false,
          title: "Бризер 3 скорость",
          then: function(){
            dev[dest] = 3
          }
        },
        {
          low: 900,
          high: 1000,
          highInclusive: false,
          title: "Бризер 4 скорость",
          then: function(){
            dev[dest] = 4
          }
        },
        {
          low: 1000,
          high: 1200,
          highInclusive: false,
          title: "Бризер 5 скорость",
          then: function(){
            dev[dest] = 5
          }
        },
        {
          low: 1200,
          title: "Бризер 6 скорость",
          then: function(){
            dev[dest] = 6
          }
        }
      ]
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
