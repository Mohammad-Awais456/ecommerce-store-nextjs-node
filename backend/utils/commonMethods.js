import nodemailer from "nodemailer";
import dotenv from "dotenv";
import mongoose from 'mongoose';


import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { ErrorHandlerClass } from "./ErrorHandlerClass.js";
import { codeVerificatonTemplate } from "./htmlTemplates.js";


// // Dynamically set the path for .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// // Load environment variables from .env
const env_global_path= path.join(__dirname,`../env/.env`);

dotenv.config({ path:  env_global_path});

export const sendResponse = (res,statusCode=200,msg,success=false,data=null,extra=null,cookie=null)=>{

    if(cookie!==null)
    {
       const cookie_options ={
            httpOnly: cookie.httpOnly || false ,
            secure: cookie.secure || false,
            maxAge: cookie.maxAge || 1000000000,
            // sameSite: 'strict'
          }
          res.cookie(cookie.name,cookie.value,cookie_options);
    }



res.status(statusCode).json({
    statusCode,
    success,
    msg,
    extra,
    data,
    ...(cookie!==null && {[cookie.name]:cookie.value})
    

})
}
// ================= Send Mails ================
export const send_mail= async (source,destination,msg_subject,msg_body) =>
{   
   
 try {
    

    const transporter = nodemailer.createTransport({
        host: process.env.MAILER_HOST_ADDRESS,
        port: 465,
        secure: true, // true for port 465, false for other ports
        auth: {
            user: process.env.MAILR_USER_NAME,
            pass: process.env.MAILR_PASSWORD
        },
      });  


      // send mail with defined transport object
  const info = await transporter.sendMail({
    from: source, // sender address
    to: destination, // list of receivers
    subject: msg_subject, // Subject line
    // text: "Hello world?", // plain text body
    html: msg_body
  });
  console.log("Message sent: %s", info.messageId);
return info;
} catch (error) {
    console.log(error);
    
    return false;
    // return new ErrorHandlerClass("Mailing module not functioning properly!",500);
}


}

export const get_ENV_Object = async (vari_name)=>{
    

    console.log("env function called",await process.env[vari_name]);
}



export const checkTokenExpiration = (exp)=>{
    // Get the current time in seconds since the Unix epoch
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);

        // Check if the token has expired
        if (currentTimeInSeconds > exp) {
            console.log('Token has expired.');
            return true;
        } else {
            console.log('Token is still valid.');
            return false;
        }
}

//=============== Send Six Digit Code ==================
export const sendVerificationToken = async (destinationEmail) =>{
    // console.log(userData,"hello");
    


   
  return mail_response;
  
}

//=============== Password Reset Token ==================
export const GetVerificationToken =()=>{
    const sixDigitCode = generateRandomCode(6);
    const expiryTime = new Date(Date.now() + 60000*5); // 5 minutes from now
    return  {token:sixDigitCode,expiry:expiryTime }
}
//====================== Check Expiry ===================
export function isExpired(expiryDateIsoString) {
    // Parse the expiry date from the ISO string
    const expiryDate = new Date(expiryDateIsoString);
    
    // Get the current date and time
    const now = new Date();
    
    // Check if the current time is after the expiry date
    return now > expiryDate;
}
//========================== 6 Digit Code Generator =====================
export function generateRandomCode(digits) {
    const min = Math.pow(10, digits - 1); // Minimum value with the given number of digits
    const max = Math.pow(10, digits) - 1; // Maximum value with the given number of digits
    return Math.floor(min + Math.random() * (max - min + 1)); // Generate number within the range
}

// ================== Check MongoDB Id ======================
export function isValidMongoDB_Obj_Id(id) {
    return mongoose.Types.ObjectId.isValid(id);
}
// ================== Validation Error Formatter ======================
export function formateValidationError(errorMessage) {
       // Remove the unwanted prefix
       const cleanedMessage = errorMessage.replace(/^.*validation failed:\s*/, '');

       // Format the message with a label
       const formattedMessage = `Validation Error: \n${cleanedMessage.replace(/(?:\r\n|\r|\n)/g, '\n')}`;
   
       return formattedMessage;
}