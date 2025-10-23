defineGroup({
  name: "safety",
  title: "Безопасный режим"
})

function defineSafetyGuard(safe, work){
  return defineGroupGuard("safety",
  {
    on: work,
    off: safe
  })
}

global.__proto__.defineSafetyGuard = defineSafetyGuard