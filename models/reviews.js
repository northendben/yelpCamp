const mongoose = require("mongoose");
const campground = require('./campground')
const User = require('./users')
const { Schema } = mongoose;

const reviewSchema = new Schema({
	rating: {
		type: Number,
		required: true
	},
	body: {
		type: String,
		required: true
	},
    campGround: {
        type: Schema.Types.ObjectId,
        ref: 'Campground',
        required: true
    },
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

reviewSchema.post('findOneAndDelete', async function (review){
	const deletedReviewReference = await User.findOneAndUpdate({_id: review.author}, {$pull: {ratings: review._id}})
})

const Review = new mongoose.model('Review', reviewSchema)
module.exports = Review
