function defineThreshold(cfg){
  var cells  = {
  }
  for ( var p in cfg.points){
    var point = cfg.points[p]
    cells[point.name] = {
      title: point.title || point.name,
      readonly: true,
      type: "text",
      value: ""
    }
  }
  defineVirtualDevice(cfg.name,
                      {
                        title: (cfg.title || cfg.name),
                        cells: cells
                      })
  for ( var p in cfg.points) {
      var point = cfg.points[p]

      function lookupThreshold(value) {
          var index = 0;
          for (var threshold in point.thresholds) {
              threshold = point.thresholds[threshold]
              if ((threshold.low === undefined || value >= threshold.low) &&
                  (threshold.high === undefined || value <= threshold.high)) {
                  return index;
              }
              index++;
          }
          return -1;
      }

      var idx = lookupThreshold(dev[point.dev])
      if ( idx >= 0 ){
        dev[cfg.name + "/" + point.name] = point.thresholds[idx].title || idx.toString()
        point.thresholds[idx].then()        
      }
      defineRule({
          whenChanged: point.dev,
          then: function (newValue) {
              var new_idx = lookupThreshold(newValue)
              if (new_idx !== idx) {
                  idx = new_idx
                  if ( idx >= 0 ){
                    dev[cfg.name + "/" + point.name] = point.thresholds[idx].title || idx.toString()
                    log.info( newValue + " " + cfg.name + " " + point.name + " " + idx);
                    point.thresholds[idx].then()                    
                  }
              }
          }
      })
  }
}


global.__proto__.defineThreshold = defineThreshold