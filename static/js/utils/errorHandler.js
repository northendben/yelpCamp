function errorHandlerWrapper(fn){
    return function(req,res,next){
        fn(req,res,next).catch(e => {console.log('this is the droid you are looking for:', e); next(e)})
    }
}
module.exports = errorHandlerWrapper
