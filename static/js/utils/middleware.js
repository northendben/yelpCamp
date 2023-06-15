const Campground = require('../../../models/campground')
const Review = require('../../../models/reviews')
const checkLogin = function (req,res,next) {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Please login first.')
       return res.redirect('/login')
    }
    next()
}

const isEditAuthorized = async function (req,res,next) {
    if(!req.user){
        req.flash('error', "You do not have permission to perform that action")
        return res.redirect('/campgrounds')
    }
    if(req.user.isAdmin === true){
        return next()
    }
    const {id} = req.params
    const foundCreator = await Campground.findById(id).select('creator -_id')
    if(!foundCreator.creator || (req.user._id.toString() != foundCreator.creator.toString())){
        req.flash('error', "You do not have permission to perform that action")
        return res.redirect('/campgrounds')
    }
    next()
}

const canDeleteReview = async function (req,res,next) {
    if(!req.user){
        req.flash('error', "You do not have permission to perform that action")
        return res.redirect('/campgrounds')
    }
    if(req.user.isAdmin === true){
        return next()
    }
    const {reviewId} = req.body
    const foundReview = await Review.findById(reviewId).select('author -_id')
    if(!foundReview.author || (req.user._id.toString() != foundReview.author.toString())){
        req.flash('error', "You do not have permission to perform that action")
        return res.redirect('/campgrounds')
    }
    next()
}
module.exports.checkLogin = checkLogin
module.exports.isEditAuthorized = isEditAuthorized
module.exports.canDeleteReview = canDeleteReview
