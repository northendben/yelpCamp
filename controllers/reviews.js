const User = require('../models/users')
const Campground = require('../models/campground')
const Review = require('../models/reviews')

const createReview = async (req,res) => {
    const {body,rating,campground} = req.body
    const foundCampground = await(Campground.findById(campground))
    const author = await(User.findById(req.user._id.toString()))
    const newReview = new Review({body: body, rating: rating, campGround: campground, author: author})
    foundCampground.reviews.push(newReview)
    author.ratings.push(newReview)
    await Promise.all([newReview.save(), foundCampground.save(), author.save()])
    res.status(200).send('Review saved.')
}

const deleteReview = async(req,res) => {
    const {campId, reviewId} = req.body
    await Promise.all([Review.findByIdAndDelete(reviewId),Campground.findByIdAndUpdate(campId, {$pull: {reviews: reviewId} })])
    req.flash('successMessage', 'Review deleted')
    res.status(204).send('Deleted')
}

module.exports = {createReview, deleteReview}