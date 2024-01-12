const User = require("../models/user.js")

module.exports.renderSignupForm = (req,res)=>
{
    res.render("users/signup.ejs")
}

module.exports.signup = async(req,res)=>
{
    try
    {
        let {username,email,password} = req.body;
        const newUser = new User({email,username})      //creating new user with email and username
        const registeredUser=await User.register(newUser,password)      //Using .register() method to register the newUser using the password
        console.log(registeredUser)
        req.login(registeredUser,(err)=>
        {
            if(err)
            {
                return next(err);
            }
            req.flash("success","Welcome to wanderlust!")       //After successful registration a flash message is shown
            res.redirect("/listings")
        })
    }
    catch(e)
    {
        req.flash("error",e.message);
        res.redirect("/signup")     //If any error arises we will redirect the user into signup page
    }
}

module.exports.renderLoginForm = (req,res)=>
{
    res.render("users/login.ejs")
}

module.exports.login = async(req,res)=>
{
    req.flash("success","Welcome back to Wanderlust!")
    let redirectUrl = res.locals.redirectUrl || "/listings";        //If there is no redirectUrl we should redirect into the /listings page
    res.redirect(redirectUrl)
}

module.exports.logout = (req,res,next)=>
{
    req.logout((err)=>
    {
        if(err)
        {
            return next(err)
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings")
    });
}