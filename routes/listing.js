const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js")      //Schema for the MongoDB
const wrapAsync = require("../utils/wrapAsync.js")   //For server side errors
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")
const listingController = require("../controllers/listings.js")
//Multer is used to handle file uploads and make them accessible in req.body
const multer = require("multer")
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })


router.route("/")
.get(wrapAsync(listingController.index))        //index route
//upload single represents uploading single file in the given path above
.post(isLoggedIn,upload.single("listing_[image]"),validateListing,wrapAsync(listingController.createListing))        //create route


//New route
router.get("/new",isLoggedIn,listingController.renderNewForm)

router.route("/:id")
.get(wrapAsync(listingController.showListing))  //show individually
.put(isLoggedIn,isOwner,upload.single("listing_[image]"),validateListing,wrapAsync(listingController.updateListing)) //update route
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))     //delete route

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));





module.exports = router;
