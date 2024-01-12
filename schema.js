// This file is used to handle schema validation (server side)
const Joi = require('joi');
//Joi is used as validator for our schema
module.exports.listingSchema = Joi.object(
{
    listing_ : Joi.object({
        title : Joi.string().required(),    //.string() is the type of input and it is required or not
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0),     //the value of price should be 0(min)(non negative)
        image: Joi.string().allow("",null)      //Image can be allowed as null or some value
    }).required()       //But we required one listing

})


module.exports.reviewSchema = Joi.object(
    {
        review: Joi.object({
            rating : Joi.number().required().min(1).max(5),
            comment : Joi.string().required()
        }).required()
    }
)