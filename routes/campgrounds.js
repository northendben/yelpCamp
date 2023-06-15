const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const errorHandlerWrapper = require("../static/js/utils/errorHandler");
const determineError = require("../static/js/utils/determineMessage");
const joi = require("joi");
const {storage} = require('../externalAPI/cloudinary/cloudinaryConfig')
const multer = require('multer')
const upload = multer({storage})
const {
	validatePost,
	validateCampgroundPatch,
	validateReview
} = require("../static/js/utils/joiSchemas");
const customError = require("../static/js/utils/errors");
const Campground = require("../models/campground");
const Review = require("../models/reviews");
const {
	checkLogin,
	isEditAuthorized
} = require("../static/js/utils/middleware");
const User = require("../models/users");
const campgroundController = require("../controllers/campgrounds");

router.get("/", errorHandlerWrapper(campgroundController.showAllCamps));

router.get('/search', 
errorHandlerWrapper(campgroundController.searchCamps)
);

router.get(
	"/add",
	checkLogin,
	errorHandlerWrapper(campgroundController.showAddCampForm)
);

router.get("/:id", errorHandlerWrapper(campgroundController.showOneCamp));

router.get(
	"/:id/edit",
	checkLogin,
	isEditAuthorized,
	errorHandlerWrapper(campgroundController.showEditCampForm)
);
router.get(
	"/:id/edit/images",
	checkLogin,
	isEditAuthorized,
	errorHandlerWrapper(campgroundController.showEditImageForm)
);

router.put(
	"/:id",
	checkLogin,
	isEditAuthorized,
	validateCampgroundPatch,
	errorHandlerWrapper(campgroundController.updateCampground)
);

router.delete(
	"/:id",
	checkLogin,
	errorHandlerWrapper(campgroundController.deleteCamp)
);

router.post(
	"/:id/images", 
	checkLogin, 
	errorHandlerWrapper(campgroundController.deleteCampImages)
);

router.put(
	"/:id/images",
	checkLogin, 
	isEditAuthorized,
	upload.array('images'), 
	campgroundController.updateCampImages
);

router.post('/validate', validatePost, errorHandlerWrapper(async (req,res) => {
	console.log('validated')
	res.status(200).send({message: 'Camp validated'})
}))

router.post(
	"/new",
	checkLogin,
	upload.array('image'),
	// validatePost,
    // upload.single('image'),(req,res) => {
    //     console.log(req.file)
    //     console.log(JSON.stringify(req.body))
    // })
	errorHandlerWrapper(campgroundController.createCamp))

module.exports = router;
