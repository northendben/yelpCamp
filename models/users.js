const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const Reviews = require('./reviews');

const userSchema = new Schema({
    email: {
        type:String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type:String,
        required:true
    },
    ownedCampgrounds: [ {
        type: Schema.Types.ObjectId,
        ref: 'Campgrounds'
    }],
    ratings: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    isAdmin: {
        type: Boolean
    }
})
userSchema.plugin(passportLocalMongoose)

module.exports = new mongoose.model('User', userSchema)