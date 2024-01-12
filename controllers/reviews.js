const Review = require("../models/review.js")
const listing = require("../models/listing.js")

module.exports.createReview = async(req,res)=>
{
    // console.log(req.params.id)
    let listing_=await listing.findById(req.params.id)
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing_.reviews.push(newReview);   //First we need to push the review into schema of listing

    await newReview.save();     //Saving the review
    await listing_.save();      //saving the id of new review in listingschema
    req.flash('success','Your Review has been created!')  //Flash message
    res.redirect(`/listings/${listing_._id}`);
}

module.exports.destroyReview = async(req,res)=>
{
    let {id , reviewId} = req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});      //pull is used to remove all instances matched with the given condition in that field from an exisitng array
    await Review.findByIdAndDelete(reviewId)        //removing review from Review collection
    req.flash('success','Your Review has been deleted!')  //Flash message
    res.redirect(`/listings/${id}`);
}