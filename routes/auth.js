const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const passport = require('passport')
const errorHandlerWrapper = require('../static/js/utils/errorHandler')
const determineError = require('../static/js/utils/determineMessage')
const customError = require('../static/js/utils/errors')
const Campground = require('../models/campground')
const Review = require('../models/reviews')
const User = require('../models/users')
const authController = require('../controllers/authentication')


// router.get('/register', errorHandlerWrapper(async (req,res) => {
//     res.render('auth/register')
//     console.log(req.session)
// }))
router.get('/register', errorHandlerWrapper(authController.showRegisterPage))

// router.post('/register', errorHandlerWrapper(async (req,res, next) => {
//     const userData = {username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email}
//     const newUser = await User.register(userData, req.body.password)
//     req.login(newUser, err =>{
//         if(err){
//             return next(err)
//         } else {
//             req.flash('successMessage', 'Accounted Created')
//             res.status(200).send({message:'Successful Registration and Login', status: 200, success: true})
//         }
//     })
// }))
router.post('/register', errorHandlerWrapper(authController.registerUser))

router.get('/login', errorHandlerWrapper(authController.showLoginpage))

// router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), (req,res) =>{
//     req.flash('successMessage', 'Welcome back')
//     let {prevPage} = req.query
//     prevPage.includes('login') ? prevPage = '/campgrounds':null
//     let redirectUrl = ''
//     req.session.returnTo ? redirectUrl = req.session.returnTo: redirectUrl = prevPage
//     console.log(redirectUrl)
//     delete req.session.returnTo
//     if(redirectUrl){
//         res.redirect(redirectUrl)
//     } else {
//     res.redirect('/campgrounds')
//     }
// })
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), authController.loginUser)

router.post('/logout', errorHandlerWrapper(authController.logoutUser))

module.exports = router