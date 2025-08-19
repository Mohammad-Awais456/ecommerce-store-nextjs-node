import { checkTokenExpiration, sendResponse } from "../utils/commonMethods.js";
import { promisesHandler } from "./promisesHandler.js"
import { userModel } from "../Database/models.js";
import { ErrorHandlerClass } from "../utils/ErrorHandlerClass.js";
import jwt from "jsonwebtoken";

export const Authenticator = promisesHandler(async (req,res,next)=>
{

    // Removing token from client side
   const cookie_information = {
    name:"loginToken",
    value:"",
    maxAge:0
  
  }

    const {loginToken}=req.cookies;
    console.log("Login Token:",loginToken);
    
    
    if (!loginToken) 
        {
            return sendResponse(res,400,"Please, login first!",false);
            
        }
        
        // verify the token
        const decodedData = jwt.verify(loginToken, process.env.JWT_SECRET_KEY);
        console.log(decodedData, "decoded data from token");

        // If token not get verified found then this code will run 
        if (!decodedData) 
        {  
            return sendResponse(res,400,"Please, login first!",false,null,null,cookie_information);
        }
        if(checkTokenExpiration(decodedData.exp))
        {
            return sendResponse(res,400,"Login Session Expired!",false,null,null,cookie_information);
           
        }
       
    
    const userDetails = await userModel.findOne({_id:decodedData._id});

    if (!userDetails) {

        return sendResponse(res,400,"Account not found! Please, login again!",false,null,null,cookie_information);
        

    }
    else
    {
        req.user = userDetails;
        return next();

    }

    // sendResponse(res,200,"Everything is ok",true);


});

export const isAccountVerified = promisesHandler (async (req,res,next)=>{

    const verficationStatus = req.user.verified;

    return verficationStatus !== true?
    next(new ErrorHandlerClass("Only verfied account can access this resource!",400))
    :
    next();
    



})

export const verifyRoles = (...roles)=>{
 
    return (req,res,next) =>{

       
        if(!roles.includes(req.user.role))
        {
            return next(new ErrorHandlerClass(`${req.user.username} is not allowed to access this resource.`,403));
        }
        
         next();
       

    }
    
    
}