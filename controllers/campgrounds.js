const customError = require('../static/js/utils/errors')
const Campground = require('../models/campground')
const Review = require('../models/reviews')
const mongoose = require('mongoose')
const User = require('../models/users')
const cloudinary = require('cloudinary')
const mapBoxGeo = require('../externalAPI/Mapbox/mapBoxConfig')

const showAllCamps = async (req,res) => {
    const campGrounds = await Campground.find({})
    const campGroundsJSON = JSON.stringify(campGrounds)
    res.render('campgrounds/index.ejs', {campGrounds, campGroundsJSON})
}

const showAddCampForm = async (req,res) => {
    res.render('campgrounds/createCampground.ejs')
}

const showOneCamp = async (req,res) => {
    const {id} = req.params
    const foundCampground = await(Campground.findById(id)).populate(
        {
        path: 'reviews',
        populate: {
            path: 'author',
            select: 'username'
        }
    })
    if(!foundCampground) throw new customError(404, 'Cannot Find Campground')
    res.render('campgrounds/singleCampground.ejs', {foundCampground})
}

const showEditCampForm = async (req,res) => {
    const {id} = req.params
    const foundCampground = await(Campground.findById(id))
    res.render('campgrounds/editCampgrounds', {foundCampground})
}

const showEditImageForm = async (req,res) => {
    const {id} = req.params
    const foundCampground = await(Campground.findById(id))
    res.render('campgrounds/editImages', {foundCampground})
}

-122.904919, 46.273991 

const updateCampground = async (req,res) => {
    const {id} = req.params
    let update = req.body
    if(update.location){
        const mbReq = await mapBoxGeo.forwardGeocode({
            query: update.location,
            limit: 1,
            types: ['place']
        }).send()
        const coordinates = mbReq.body.features[0].geometry
        update.geometry = coordinates
    }
    try {
        const updatedCamp = await Campground.findByIdAndUpdate(id, update, {new: true, runValidators: true})
        req.flash('successMessage', 'Campground Updated')
        res.status(200).send({"msg": updatedCamp})
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}

const deleteCamp = async (req,res) => {
    const {id} = req.params
    if(!mongoose.isValidObjectId(id)) res.status(400).send({"message": "Invalid ID", "status": 400})
    const deletedCamp = await Campground.findByIdAndDelete(id)
    req.flash('successMessage', 'Campground has been deleted')
    if(!deletedCamp) res.status(404).send({'message': 'Campground Not Found', 'status': 404})   
    res.status(204).send({"message": "Deleted", "status": 204})
}

const deleteCampImages = async (req,res) => {
    const {id} = req.params
    const images = req.body
    console.log(images)
    // const imagesToDelete = images.map(image => new mongoose.Types.ObjectId(image))  note: used this with objectIds. switched to fn for cloudinary
    for(let image of images){
        await cloudinary.v2.uploader.destroy(`${image}`)
    } 
    const foundCamp = await Campground.findByIdAndUpdate(id, {$pull: {"images": {filename: { $in: images }}}}, {new: true})
    req.flash('successMessage', 'Images deleted')
    res.status(200).send({camp: foundCamp, images: images})
}

const updateCampImages = async (req,res) => {
    const {id} = req.params
    const foundCampground = await Campground.findById(id)
    const images = req.files.map((file) => ({filename: file.filename, url: file.path}))
    console.log('here')
    console.log(images)
    foundCampground.images.push(...images)
    await foundCampground.save()
    req.flash('successMessage', 'Images added')
    res.status(200).send({'message': 'Images added'})
}

const createCamp = async (req,res,next) => {
    let campData = (req.body)
    if(req.files.length > 0){
        campData.images = req.files.map((file) => ({filename: file.filename, url: file.path}))
    }
    const mbReq = await mapBoxGeo.forwardGeocode({
        query: campData.location,
        limit: 1,
        types: ['place', 'district']
    }).send()
    const coordinates = mbReq.body.features[0].geometry
    campData.geometry = coordinates
    console.log(campData)
    console.log(coordinates)
    const userToUpdate = await User.findById(req.user._id)
    const creator = req.user._id.toString()
    campData.creator = creator
    const newCamp = new Campground(campData)
    const newId = (newCamp._id.toString())
    userToUpdate.ownedCampgrounds.push(newCamp)
    await Promise.all([newCamp.save(), userToUpdate.save()])
    req.flash('successMessage', 'New Campground Added')
    res.status(200).send({"Msg": "Campground saved", "Status": 200, "Id": newId})
}

const searchCamps = async (req,res) =>{
    const {q} = req.query
    const campGrounds = await Campground.find({$or:[{title: {$regex: q, $options: 'i'}}, {location: {$regex: q, $options: 'i'}}, {description: {$regex: q, $options: 'i'}}]})
    const campGroundsJSON = JSON.stringify(campGrounds)
    res.render('campgrounds/index.ejs', {campGrounds, campGroundsJSON})
}

module.exports = {showAllCamps, showAddCampForm, showOneCamp, showEditCampForm, updateCampground, deleteCamp, createCamp, showEditImageForm, deleteCampImages, updateCampImages,searchCamps}