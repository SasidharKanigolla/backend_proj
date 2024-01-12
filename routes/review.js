const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js")   //For server side errors
const Review = require("../models/review.js")
const listing = require("../models/listing.js")      //Schema for the MongoDB
const {validateReview, isLoggedIn,isReviewedAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js");

//reviews
//post review route
router.post("/",
isLoggedIn,
validateReview,     //For validating reviews from third party senders(hoppscotch)
wrapAsync(reviewController.createReview))

//Delete review route
router.delete("/:reviewId",
isLoggedIn,
isReviewedAuthor,
wrapAsync(reviewController.destroyReview))

module.exports = router;