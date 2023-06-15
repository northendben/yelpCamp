const passport = require('passport')
const User = require('../models/users')

const showRegisterPage = async (req,res) => {
    res.render('auth/register')
    console.log(req.session)
}

const registerUser = async (req,res, next) => {
    const userData = {username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email}
    const newUser = await User.register(userData, req.body.password)
    req.login(newUser, err =>{
        if(err){
            return next(err)
        } else {
            req.flash('successMessage', 'Accounted Created')
            res.status(200).send({message:'Successful Registration and Login', status: 200, success: true})
        }
    })
}

const showLoginpage = async (req,res) => {
    res.render('auth/login.ejs')
}

const loginUser = (req,res) =>{
    req.flash('successMessage', 'Welcome back')
    let {prevPage} = req.query
    console.log(prevPage)
    prevPage.includes('login') || prevPage === 'http://localhost:3000/' ? prevPage = '/campgrounds':null
    let redirectUrl = ''
    req.session.returnTo ? redirectUrl = req.session.returnTo: redirectUrl = prevPage
    delete req.session.returnTo
    if(redirectUrl){
        res.redirect(redirectUrl)
    } else {
    res.redirect('/campgrounds')
    }
}
const logoutUser = async(req,res)=> {
    req.logout((err) => {
        if(err){
            next(err) 
        } else {
            req.flash('successMessage', 'You have been logged out')
            res.status(200).send({message: 'Logged out', status:200})
        }
    })
}

module.exports = {showRegisterPage, registerUser, showLoginpage,loginUser, logoutUser}