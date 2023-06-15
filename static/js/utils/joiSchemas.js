const baseJoi = require('joi')
const customError = require('./errors')
const determineError = require('./determineMessage')
const sanitizeHtml = require('sanitize-html')
const joi = baseJoi.extend((joi) => {
    return {
        type: 'string',
        base: joi.string(),
        messages: {
            'string.escapeHTML': '{{#label}} must not include any HTML or Javascript'
        },
        rules: {
            escapeHTML: {
                validate(value, helpers) {
                    const clean = sanitizeHtml(value, {
                        allowedTags: [],
                        allowedAttributes: {},
                    });
                    if(clean !== value){
                        return helpers.error('string.escapeHTML', { value })
                    }
                    return clean;
                }
            }
        }
    }
});

const validatePost = (req,res,next) => {
    console.log(req.body)
        const campGroundSchema =  joi.object({
        title: joi.string().required().escapeHTML(),
        price: joi.number().required().min(0),
        image: joi.array().allow(null,''),
        location: joi.string().required().escapeHTML(),
        description: joi.string().required().escapeHTML()
    })
    const result = campGroundSchema.validate(req.body)
    if(result.error){
        const errorMsg = result.error.details.map(err => err.message).join(',')
        throw new customError(400, errorMsg)
    } else {
        next()
    }
    }

    const validateReview = (req,res,next) => {
        const reviewValidationSchema = joi.object({
            rating: joi.number().required(),
            body: joi.string().required().escapeHTML(),
            campground: joi.string().required().escapeHTML()
        })
        const result = reviewValidationSchema.validate(req.body)
        if(result.error){
            const errorMsg = result.error.details.map(err => err.message).join(',')
            throw new customError(400, errorMsg)
        } else{
            next()
        }
    }

    const validateCampgroundPatch = (req,res,next) => {
        const campGroundPatchSchema = joi.object({
            title: joi.string().escapeHTML(),
            price: joi.number().min(1),
            image: joi.string().allow(null,''),
            location: joi.string().escapeHTML(),
            description: joi.string().escapeHTML()
        }).min(1)
        const result = campGroundPatchSchema.validate(req.body)
    if(result.error){
        console.log('ruh roh')
        const errorMsg = result.error.details.map(err => err.message).join(',')
        throw new customError(400, errorMsg)
    } else {
        next()
    }
    }

    module.exports.validatePost = validatePost
    module.exports.validateReview = validateReview
    module.exports.validateCampgroundPatch = validateCampgroundPatch