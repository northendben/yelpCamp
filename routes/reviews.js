const express = require('express')
const router = express.Router()
const errorHandlerWrapper = require('../static/js/utils/errorHandler')
const determineError = require('../static/js/utils/determineMessage')
const joi = require('joi')
const {validatePost} = require('../static/js/utils/joiSchemas')
const {validateReview} = require('../static/js/utils/joiSchemas')
const customError = require('../static/js/utils/errors')
const Campground = require('../models/campground')
const Review = require('../models/reviews')
const {checkLogin, canDeleteReview} = require('../static/js/utils/middleware')
const User = require('../models/users')
const reviewController = require('../controllers/reviews')

// router.post('', checkLogin, validateReview, errorHandlerWrapper( async (req,res) => {
//     const {body,rating,campground} = req.body
//     const foundCampground = await(Campground.findById(campground))
//     const author = await(User.findById(req.user._id.toString()))
//     const newReview = new Review({body: body, rating: rating, campGround: campground, author: author})
//     foundCampground.reviews.push(newReview)
//     author.ratings.push(newReview)
//     await Promise.all([newReview.save(), foundCampground.save(), author.save()])
//     res.status(200).send('Review saved.')
// }))
router.post('', checkLogin, validateReview, errorHandlerWrapper(reviewController.createReview))

router.delete('/delete', checkLogin, canDeleteReview, errorHandlerWrapper(reviewController.deleteReview))

module.exports = router