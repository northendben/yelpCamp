function determineMessage(err,req,res,next){
    let render = null
    req.method==='GET'? render=true:render=false
    console.log(render)
    if(err.name === "MongooseError" || err.name ==="MongooseServerSelectionError"){
        if(req.method ==='GET'){
            console.log('GET')
            render = true
            let message = 'Server Error'
            let status = 500
            return{message,status,render}
        } else {
        res.status(500).send({"message": "Server Error", "source": err.name, "status": 500})
        render = false
        let message="Uh Oh..Something has gone wrong on our end."
        let status=500
        return{message,status,render}
        }
    }
    if(err.name === "CastError" && err.path === "_id"){
        let message = "Page Not Found"
        let status = 404
        return {message,status, render}
    } 
    if(err.name ==='UserExistsError'){
        let message = 'A user with that name already exists'
        let status = 400
        return{message,status,render}
    } else {
        let message = err.message
        let status = 500
        err.status ? status = err.status:null
        if(render === true){
            return {message,status,render}
        } else {
            console.log('hui')
            res.status(status).send({message: message, status: status})
            return{message,status,render}
        }
    }
} 
module.exports = determineMessage