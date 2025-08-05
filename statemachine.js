function createSM(args, transitions, initial){
    var sm = {
        current: null,
        next: initial,
        context: args,
        timers: {},
        startTimer: function (sm, evt, duration) {
            if(sm.timers.hasOwnProperty(evt)){
                clearTimeout(sm.timers[evt])
            }
            sm.timers[evt] = setTimeout(function(){
              log.info("sm " + JSON.stringify(sm) + " " + evt);
                if(sm.timers.hasOwnProperty(evt)){
                    delete(sm.timers[evt])
                }
                sm.handle(sm, evt)
            }, duration, sm, evt)
        },
        stopTimer: function (sm, evt) {
            if(sm.timers.hasOwnProperty(evt)){
                clearTimeout(sm.timers[evt])
                delete(sm.timers[evt])
            }
        },
        handle: function (sm, evt, args) {
            if(sm.current != null &&
             sm.current.hasOwnProperty(evt)){
                sm.current[evt](sm, evt, args)
                sm.commit(sm)
            }
        },
        change: function (sm, next) {
            sm.next = next
        },
        commit: function(sm){
            while(sm.next !== null){
                if(sm.current !== null){
                    if(sm.current.hasOwnProperty("exit")){
                        sm.current.exit(sm)
                    }
                }
                sm.current = null
                if (sm.transitions.hasOwnProperty(sm.next)){
                    sm.current = sm.transitions[sm.next]
                    sm.next = null
                    if(sm.current.hasOwnProperty("enter")){
                        sm.current.enter(sm)
                    }
                }else{
                    log.error("Could not change state to " + sm.next)
                }
            }
            return sm
        },
        transitions: transitions
    };
    return sm.commit(sm);
}

global.__proto__.createSM = createSM
