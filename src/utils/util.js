export function asyncFun(fun, params, bind) {
    return new Promise(function(r,j){
        try {
            fun.call(bind, params, res=>{
                r(res)
            })
        } catch (error) {
            j(error)
        }
    })
}