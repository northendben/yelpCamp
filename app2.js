//global vars and imports
if(process.env.NODE_env !=="production"){
    require('dotenv').config()
}
console.log(process.env.cloudinaryAPIKey)
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize')
const ejsMate = require('ejs-mate');
const passport = require('passport');
const securityHelmet = require('helmet')
const localStrategy = require('passport-local');
const errorHandlerWrapper = require('./static/js/utils/errorHandler');
const customError = require('./static/js/utils/errors');
const determineError = require('./static/js/utils/determineMessage');
const joi = require('joi');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const errorRoutes = require('./routes/errors');
const authRoutes = require('./routes/auth')
const templateBuilder = require('./static/js/utils/errorTemplateLookup');
const Campground = require('./models/campground');
const Review = require('./models/reviews');
const User = require('./models/users');
const session = require('express-session');
const mongoStore = require('connect-mongo')
const flash = require('connect-flash');
const favicon = require('serve-favicon')
const oneDayInMilis = 1000*60*60*24
const oneDayInSeconds = 24*3600
// const dbUrl = process.env.dbURL //prod
const dbUrl = 'mongodb://127.0.0.1:27017/yelpCamp' //dev
const helmetConfig = require('./static/js/utils/security/helmetConfig.js')
const store = mongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: oneDayInSeconds,
    crypto: {
        secret: process.env.sessionSecret
    }
})
const sessionOptions = {
    store: store,
	saveUninitialized: false,
    secret:process.env.sessionSecret,
    resave: false,
    cookie: {
        name: 'ycSession',
        expires: Date.now() + oneDayInMilis,
        maxAge: oneDayInMilis,
        httpOnly: true
    }
}
const mapBoxGeo = require('./externalAPI/Mapbox/mapBoxConfig')

//app settings
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/static')))
app.use(express.urlencoded({ extended: true})) 
app.use(express.json())
app.use(favicon(__dirname + '/static/images/favicon.ico'))
app.use(session(sessionOptions))
app.use(flash())
app.use(securityHelmet.contentSecurityPolicy({ directives: {
    imgSrc: [...helmetConfig.allowedImageSources],
    fontSrc: [...helmetConfig.allowedFontSources],
    scriptSrc: [...helmetConfig.allowedScriptSources],
    connectSrc: [...helmetConfig.allowedConnectSources],
    workerSrc: [...helmetConfig.allowedWorkerSources]
}}))
app.engine('ejs', ejsMate)
mongoose.set('strictQuery', false);

//auth
passport.use(User.createStrategy())
app.use(passport.initialize())
app.use(passport.session())
app.use(mongoSanitize({
    replaceWith: '_'
}))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next) => {
	res.locals.successMessage = req.flash('successMessage')
	res.locals.errorMessage = req.flash('error')
    res.locals.authenticatedUser = req.user
    res.locals.prevPage = req.headers.referer
	next()
})

// app.use((req,res,next) => {
//     next()
// })
//routes
app.use('/campgrounds', campgroundRoutes)
app.use('/reviews', reviewRoutes )
app.use('/errors', errorRoutes)
app.use('', authRoutes)

main().catch(err => console.log(err, 'Your connection failed'));
async function main() {
    // await mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')
    await mongoose.connect(dbUrl)
    console.log('Connected')
}

app.get('/', async (req,res) =>{
    res.render('home')
})


// app.use('/favicon.ico', (req,res,next) =>{
//     return res.status(204).send('All good')
// })

app.all('*', (req,res,next) => {
    next(new customError(404, 'Page Not Found'))
})

app.use((err, req,res,next)=>{
    err=determineError(err,req,res,next)
    if(err.render === true){
        res.render('errors/errors', {error: err, templateBuilder: templateBuilder})
    } else {
        res.status(err.status).send(JSON.stringify(err.message))
    }
})

app.listen(3000, ()=> {
    console.log('Listening on the port 3000')
})