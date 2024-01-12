const listing = require("./models/listing.js")
const ExpressError = require("./utils/ExpressError.js") //For express errors
const { listingSchema,reviewSchema } = require("./schema.js"); //For validating the schema(serverside)
const Review = require("./models/review.js")
//To check whether the user is logged in or not
module.exports.isLoggedIn=(req,res,next)=>
{      
    if(!req.isAuthenticated())      //If the user is not logged in we have to redirect into home route with flash message
    {
        //redirectURL
        // console.log(req.path,"..",req.originalUrl)
        req.session.redirectUrl = req.originalUrl;      //If the user is trying to login we should store it's originalUrl in the sessions
        req.flash("error","You must be logged in to create/edit listing!")
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>
{
    if(req.session.redirectUrl)     //If there is a redirectUrl in the sessions data
    {
        res.locals.redirectUrl = req.session.redirectUrl;       //We should the redirectUrl into the locals(Can be used in ejs without any passing of the data)
    }
    next()
}

module.exports.isOwner = async(req,res,next)=>
{
    let {id} = req.params;
    let listing_=await listing.findById(id);
    if(!listing_.owner.equals( res.locals.currUser._id ))
    {
        req.flash("error","You are not the owner of the listing")
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.validateListing = (req,res,next)=>        //This function is used to validate all the listings when created or updated
{
    let {error} = listingSchema.validate(req.body)      //listingSchema is an another function which we have imported
    if(error)
    {
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg);     //Throwing the error as ExpressError with 400 as a statusCode and errMsg as Message
    }
    else
    {
        next();     //If no error occurs we can continue with the further steps
    }
}

module.exports.validateReview = (req,res,next)=>        //This function is used to validate all the reviews when created or updated
{
    let {error} = reviewSchema.validate(req.body)      //reviewSchema is an another function which we have imported
    if(error)
    {
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg);     //Throwing the error as ExpressError with 400 as a statusCode and errMsg as Message
    }
    else
    {
        next();     //If no error occurs we can continue with the further steps
    }
}

module.exports.isReviewedAuthor = async(req,res,next)=>
{
    let {id,reviewId} = req.params;
    let review=await Review.findById(reviewId);
    if(res.locals.currUser && !review.author.equals( res.locals.currUser._id ))
    {
        req.flash("error","You are not the author of the review")
        return res.redirect(`/listings/${id}`)
    }
    next();
}