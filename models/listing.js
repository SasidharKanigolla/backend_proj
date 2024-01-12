const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js")

//Common schema(format) for all the data
const listingSchema = new Schema({
    title:{
        type: String,
        required:true,
    },
    description:String,
    image:{
        url: String,
        filename: String,
    },
    price:Number,
    location : String,
    country:String,
    reviews :
    [
        {
            type:Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,  //reference to user model id
        ref: "User"
    },
   geometry:        //Storing the geometry as the schema in the mapbox
   {
        type:{
            type: String,   
            enum: ["Point"],    //It refers the GeoJson(Geographical JSON)
            required: true
        },
        coordinates: {
            type: [Number],     //Coordinates is an array with longitude,latitude(in order as mentioned)
            required: true,
        }
    },
});
//Deleting  all the reviews of a particular lisitng using the middleware
// findOneAndDelete is the middleware 
listingSchema.post("findOneAndDelete",async(listing_)=>{
    if(listing)
    {
        await Review.deleteMany({_id: {$in: listing_.reviews}});
    }
})

const listing = mongoose.model("listing",listingSchema);
module.exports = listing;