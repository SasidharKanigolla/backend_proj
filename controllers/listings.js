const listing = require("../models/listing.js")
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });
const ExpressError = require("../utils/ExpressError.js") //For express errors
 

module.exports.index = async (req,res,next)=>
{
    let {q} =req.query;
    if(!q)
    {
        const allListings = await listing.find()
        // console.log(allListings)
        res.render("listings/index.ejs",{allListings});     
    }
    else        //If any query given by the user
    {
        // The 'i' flag makes the regular expression case-insensitive. So, it will match names regardless of case.
        let allListings = await listing.find({location: { $regex: new RegExp(q, 'i') }})
        if(allListings.length === 0)
        {
            // console.log("country")
            allListings = await listing.find({country: { $regex: new RegExp(q, 'i') }})
            if(allListings.length === 0)
            {
                req.flash("error","No results for that search.")
                return res.redirect("/listings")
            }
            
        }
        // console.log(allListings);
        req.flash("success","Matched listings with the given destination")
        res.render("listings/index.ejs",{allListings});     

    }
}

module.exports.renderNewForm =(req,res)=>
{
    res.render("listings/new.ejs");
}

module.exports.showListing =async (req,res)=>
{
    let {q} =req.query;
    if(q)
    {
        return res.redirect(`/listings?q=${q}`)
    }

    let {id} = req.params;
    const listing_  = await listing.findById(id)
        .populate({
            path: "reviews",
            populate:
            {
                path: "author",
            },
        })        //Used to display the contents of review using it's ID
        .populate("owner");        //To display the owner details
    if(!listing_)
    {
        req.flash("error","Listing you requested for does not exist!")
        res.redirect("/listings");
    }
    // console.log(listing_)
    res.render("listings/show.ejs",{listing_});
}

module.exports.createListing = async (req,res,next)=>        //wrapAsync is used to check for schema validations
{
    //Storing the location coordinates based on the given text location
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing_.location,      
        limit: 1    //No.of coordinates for the given location
      })
        .send()

    let url = req.file.path
    let filename = req.file.filename
    const newList = new listing(req.body.listing_);    //new way
    //For getting the user data ,we used req.user--> It returns the whole data(except hashing and salting) of the user stored in the DB from that we are storing its _id
    newList.owner = req.user._id        //When ever a new listing is saved we have to store the owner Object_id in the schema .
    newList.image = {url,filename}
    newList.geometry = response.body.features[0].geometry   //Taking the coordinates part from the response's body 

    await newList.save().then((res)=>{console.log(res)});
    req.flash('success','Your Listing has been created!')  //Flash message
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req,res)=>
{
    let {id} = req.params;
    let listing_ = await listing.findById(id);
    if(!listing_)
    {
        req.flash("error","Listing you requested for does not exist!")
        res.redirect("/listings");
    }
    let originalImageUrl=listing_.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs",{listing_,originalImageUrl});
} 

module.exports.updateListing = async (req,res)=>
{
    if(!req.body.listing_)
    {
        throw new ExpressError(400,"Send valid data for listing")
    }
    let {id} =req.params;
    let listing_ = await listing.findByIdAndUpdate(id,{...req.body.listing_});     //      ... -> deconstructor (used to deconstruct the listing_)

    if(typeof req.file !== "undefined")
    {
        let url = req.file.path
        let filename = req.file.filename
        listing_.image = {url,filename}
        await listing_.save();
    }

    req.flash('success','Your Listing has been updated!')  //Flash message
    res.redirect(`/listings/${id}`)
}

module.exports.destroyListing = async (req,res)=>
{
    let {id} = req.params;
    let deletedList = await listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash('success','Your Listing has been deleted!')  //Flash message
    res.redirect("/listings");
}