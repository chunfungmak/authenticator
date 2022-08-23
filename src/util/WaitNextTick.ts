export function waitNextTick(fn: Function){
    setTimeout( ()=> {
        fn()
    }, 1)
}
