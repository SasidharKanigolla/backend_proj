const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport= require("passport");     //authentication middleware for node.js
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js")

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup))

router.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl,        //First we need to save the user's previous path before logging in for user convienenace
    //Because when we logged in all the details in the session will be changed so,First we need to store the path in the locals
    passport.authenticate("local",      //using .authenticate for verifying the password of the specified username
    {
    failureRedirect: '/login',      //If any failure(mismatch between username and password) we will redirect into login page
    failureFlash: true      //And passes a flash message
    }),  
    userController.login)

router.get("/logout",userController.logout)

module.exports = router;