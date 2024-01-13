if(process.env.NODE_ENV != "production")        //We are not going to use the .env file in the production because it contains confidential data
{
    require('dotenv').config()      //dotenv is an extension used for retriving the data from .env file without using the file
}

//packages
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");    //For using same template for multiple pages
const ExpressError = require("./utils/ExpressError.js") //For express errors
const session = require("express-session")      //Express session
const MongoStore = require("connect-mongo")
const flash = require("connect-flash")      //Connect flash is used to show the flash message
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")



//Routes
const listingsRouter = require("./routes/listing.js");    //For normal routes
const reviewsRouter = require("./routes/review.js");  //For review routes
const userRouter = require("./routes/user.js"); 
const dbUrl = process.env.ATLASDB_URL       //url is taken from atlas website(databse url)

//middlewares and some values assigning
app.use(express.static(path.join(__dirname, "/public")));       //To join static files like css and js
app.set("view engine","ejs");       //Setting view engine as ejs
app.set("views",path.join(__dirname,"views"));      
app.use(express.urlencoded({extended:true}));       //A middleware used to parse the requests
app.use(methodOverride("_method"));     //Using method override as _method
app.engine('ejs',ejsMate);      //EJS mate is used as a common template for all the ejs files


main()      //Establishing connection b/w server and express
.then(()=>{console.log("connection to DB is successful")})        //if no error
.catch(err => console.log(err));        //if error print the error

async function main()
{
    await mongoose.connect(dbUrl);       //port number and db name for connecting express with DB
}

const store = MongoStore.create({       //Used to restore data from db
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,        //For every 24hrs the data loads from the db
});

store.on("error",()=>
{
    console.log("Error in MONGO session store",err)     
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,        //secret must be long, But now we are using this temporarily
    resave: false,      //It forces to resave the data whether it is changed or not
    saveUninitialized : true,       //Used to save the uninitialized data
    cookie :        //session contains cookie
    {
        expires: Date.now() + 7*24*60*60*1000,      //The cookie will expire in today + 7days
        maxAge : 7*24*60*60*1000,       //Same as expire
        httpOnly: true      //default value
    }
}


app.use(session(sessionOptions));       //initializing the session
app.use(flash())        //flash must be called after the session

app.use(passport.initialize())      //For initializing the passport
app.use(passport.session())     //passport must use session for authentication in all pages of the website
passport.use(new LocalStrategy(User.authenticate()))        //passport uses LocalStrategy method to authenticate the user
// Searialized and desearialized user are used for authentication
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success = req.flash("success")       //whenever the req.flash("success") is initialized the value will be stored in this locals
    res.locals.error = req.flash("error")       //whenever the req.flash("error") is initialized the value will be stored in this locals
    res.locals.currUser = req.user;     //It stores the current user details like username and email
    next();     //After storing the particular value we are again sending the handle to their callbacks
})


//middlewares for all paths
app.use("/listings",listingsRouter);  //Matches the paths /listings 
app.use("/listings/:id/reviews",reviewsRouter)    //Matches the paths /listings/:id/reviews
app.use("/",userRouter) //Home page router

//Error handling
app.all("*",(req,res,next)=>
{
    next(new ExpressError(404,"Page Not Found"));       //The pages other than mentioned above requests occur we can pass it as a error 404 with message Page Not Found
})

app.use((err,req,res,next)=>        //Common middleware for all paths and used to display the error message
{
    let {statusCode = 500, message = "Something went wrong!!"}=err;
    res.status(statusCode).render("listings/error.ejs",{ err });
})

app.listen(8080,()=>
{
    console.log("Listening from port 8080");        //For listening
});
