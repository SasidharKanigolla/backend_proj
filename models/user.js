const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passpotLocalMongoose = require("passport-local-mongoose")

const userSchema = new Schema({
    email:{
        type: String,
        required: true
    }
    /*
    In this we just defined email,but we need the username and password 
    For that username and password we have pluged-in below this comment
    By plugging-in we get the schema for both username and password with hashing and salting functions
    So with that we can directly access the username and password while defining the schema
    */
});

userSchema.plugin(passpotLocalMongoose);;

module.exports = mongoose.model('User', userSchema)

