const mongoose = require('mongoose')
const Reviews = require('./reviews')
const Users = require('./users')
const Schema = mongoose.Schema

const imageSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
})

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload/', '/upload/h_140,w_250,c_pad/')
})

const campGroundSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    price: {
    type: Number,
    required: false,
    },
    description: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: true
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [imageSchema],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

campGroundSchema.post('findOneAndDelete', async function(campGround){
    if(campGround.creator){
        const deletedOwners = await Users.findOneAndUpdate({_id: campGround.creator}, {$pull: {ownedCampgrounds: campGround._id}})
    }
    if(campGround.reviews.length > 0){
        const foundReviews = await Reviews.find({_id: {$in: campGround.reviews}})
        let reviewArray = []
        let reviewAuthors = []
        for(let review of foundReviews){
           reviewArray.push(review._id)
           reviewAuthors.push(review.author)
        }
        const deletedReviewRef = await Users.updateMany({_id: {$in:reviewAuthors}}, {$pull: {ratings: {$in: reviewArray}}})
        const deleted = await Reviews.deleteMany({_id: {$in:campGround.reviews}})
    }
})
const Campground = new mongoose.model('Campground', campGroundSchema)
module.exports = Campground