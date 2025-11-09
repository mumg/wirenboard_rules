function pulsate(name, period){
  var ctx = {
    timer: setInterval(function(){
      name.forEach(function(c){
        dev[c] = !dev[c]
      })
    }, period * 1000),
    cancel: function(){
      clearInterval(ctx.timer)
      name.forEach(function(c){
        dev[c] = false
      })
    }
  }  
  return ctx
}

global.__proto__.pulsate = pulsate