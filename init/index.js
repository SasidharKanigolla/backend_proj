const mongoose=require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");        // .. is mentioned as file is in another folder 

main()      //Establishing connection b/w server and express
.then(()=>{console.log("connection is successful")})        //if no error
.catch(err => console.log(err));        //if error print the error

async function main()
{
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");       //port number and db name
}

const initdb= async ()=>
{
    await listing.deleteMany({});         //deleting all listings from the database
    initdata.data = initdata.data.map((obj) =>({
        ...obj,
         owner: "659bf167824a08110a063676"
        }))
    await listing.insertMany(initdata.data);        //Intializing the dataset at the start of the project

    console.log("Data added to the database successfully!");
}
initdb();
