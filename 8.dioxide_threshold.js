function createDioxideThreshold(source, dest){
  return {
      dev: source,
      name: "CO2",
      title: "Порог C02",
      thresholds: [
        {
          high: 549,
          title: "Бризер 1 скорость",
          then: function(){
            dev[dest] = 1
          }
        },
        {
          low: 700,
          high: 799,
          title: "Бризер 2 скорость",
          then: function(){
            dev[dest] = 2
          }
        },
        {
          low: 800,
          high: 899,
          title: "Бризер 3 скорость",
          then: function(){
            dev[dest] = 3
          }
        },
        {
          low: 900,
          high: 999,
          title: "Бризер 4 скорость",
          then: function(){
            dev[dest] = 4
          }
        },
        {
          low: 1000,
          high: 1199,
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
