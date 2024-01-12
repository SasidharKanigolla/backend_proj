module.exports=(fn)=>
{
    return (req,res,next)=>
    {
        fn(req,res,next).catch(next);       //If any error arises in the async function we are passing the error into the middleware
    }
}
/*
    Middle ware is a function which takes function as a parameter and returns a function 
*/