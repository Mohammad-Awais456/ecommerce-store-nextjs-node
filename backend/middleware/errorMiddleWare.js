import mongoose from "mongoose";
import { ErrorHandlerClass } from "../utils/ErrorHandlerClass.js";
import { formateValidationError, sendResponse } from "../utils/commonMethods.js";

export const ErrorHandlerMiddleware =(err,req,res,next)=>
{

      console.log("this is error message:\n",err.stack);
      console.log(err.message);
      console.log(err.type);
            const emptry_cookie_information = {
            name:"loginToken",
            value:"",
            maxAge:0
            
            }
      err.message = err.message || "Internal Server Error 500";
      err.statusCode = err.statusCode || 500;

      if(err.type ===  'entity.too.large')
      {
      err.statusCode = 413;
      err.message ="This file is larger then ower limit";
      }
      else if(err.message === 'jwt expired')
      {
       console.log("hello epxired");
          
                        return sendResponse(res,400,"Login Session Expired!",false,null,null,emptry_cookie_information);

      }
      else if(err.code === 11000)
      { 
            const errorCause = (err.message.match(/{[^}]*}/)[0]).replace(/(\w+):/g, '"$1":'); ;
            if(errorCause.includes("username"))
            {
                  err.message = `Username:  '${JSON.parse(errorCause).username}' is already taken. Please choose a different username.`;
            }
                   
                   else if(errorCause.includes("email"))
                        {
                         
                           err.message = `Email: '${JSON.parse(errorCause).email}' is already taken. Please choose a different username.`;
                        }else
                        {

                              err.message ="Duplicate Entity Not Allowed!";
                        }

            err.statusCode = 409;
            
      }

      if(err.name ===  'CastError')
      {

       err = new ErrorHandlerClass("Invalid input detected. Please ensure all provided values are correctly formatted and try again.",400);
      }
      else if(err.name ===  'ValidationError')
      {
            const formatedMessage = formateValidationError(err.message);

       err = new ErrorHandlerClass(formatedMessage,400);
      }

    //   console.log(err.limit,"limit");
    //   console.log(err.length,"length");
    //   console.log(err.statusCode,"status code");
      // console.log(`\n-----------------------------------\n\nName: ${err.name}\n\nMessage: ${err.message}\n\nError Stack: ${err.stack}\n\n-----------------------------------\n`);
     
      res.status(err.statusCode).json({
       success:false,
       msg:err.message,
       statusCode:err.statusCode
      })
   
}

export default ErrorHandlerMiddleware;