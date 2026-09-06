log.info("0.statemachine.js")
function createSM(args, transitions, initial){
    var sm = {
        current: null,
        currentName: null,
        next: initial,
        context: args,
        timers: {},
        startTimer: function (sm, evt, duration) {
            if(sm.timers.hasOwnProperty(evt)){
                clearTimeout(sm.timers[evt])
            }
            sm.timers[evt] = setTimeout(function(){
                if (evt !== "tick") {
                    log.info("sm " + sm.currentName + " " + evt)
                }
                if(sm.timers.hasOwnProperty(evt)){
                    delete(sm.timers[evt])
                }
                sm.handle(sm, evt)
            }, duration)
        },
        stopTimer: function (sm, evt) {
            if(sm.timers.hasOwnProperty(evt)){
                clearTimeout(sm.timers[evt])
                delete(sm.timers[evt])
            }
        },
        stopAllTimers: function (sm) {
            for (var evt in sm.timers) {
                if (sm.timers.hasOwnProperty(evt)) {
                    clearTimeout(sm.timers[evt])
                }
            }
            sm.timers = {}
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
            var transitionCount = 0
            while(sm.next !== null){
                transitionCount++
                if (transitionCount > 100) {
                    log.error("Too many immediate state transitions")
                    sm.next = null
                    break
                }

                var target = sm.next
                sm.next = null
                if (!sm.transitions.hasOwnProperty(target)) {
                    log.error("Could not change state to " + target)
                    continue
                }

                if(sm.current !== null){
                    sm.stopAllTimers(sm)
                    if(sm.current.hasOwnProperty("exit")){
                        sm.current.exit(sm)
                    }
                }

                sm.currentName = target
                sm.current = sm.transitions[target]
                if(sm.current.hasOwnProperty("enter")){
                    sm.current.enter(sm)
                }
            }
            return sm
        },
        transitions: transitions
    };
    return sm.commit(sm);
}

global.__proto__.createSM = createSM
