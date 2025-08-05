defineVirtualDevice("current_time", {
    title: "Current time" ,
    cells: {
      date: {
        title: "Date",
        type: "text",
        value: "1970-01-01",
        readonly: true
      },
      hours: {
        title: "Hours",
        type: "value",
        value: 0,
        readonly: true
      },
      minutes: {
        title: "Minutes",
        type: "value",
        value: 0,
        readonly: true
      },
      seconds: {
        title: "Seconds",
        type: "value",
        value: 0,
        readonly: true
      }
    }
});

setInterval( function() { 
  var dt = new Date()
  dev["current_time/date"] = dt.toISOString().substring(0,10)
  dev["current_time/hours"] = dt.getHours()
  dev["current_time/minutes"] = dt.getMinutes()
  dev["current_time/seconds"] = dt.getSeconds()
}, 1000);