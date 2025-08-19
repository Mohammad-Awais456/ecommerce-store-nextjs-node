// ==================================================
import dotenv from "dotenv";
import cors from "cors";
// import path from "path";
import { fileURLToPath } from 'url';
import path from 'path';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log(path.resolve(__dirname, './env/.env'));

dotenv.config({"path":path.resolve(__dirname, '/env/.env')});
const Products_imagesFolderPath = path.resolve(__dirname, './uploads/products');

//    Importing MOdules 
// ==================================================
import Express from "express";
import cookieParser from "cookie-parser";
import { productRouter } from "./Routes/ProductRoutes.js";
import {DbConnect} from  "./Database/DbConn.js";
import { userRouter } from "./Routes/userRoutes.js";
import { orderRouter } from "./Routes/orderRoutes.js";
import ErrorHandlerMiddleware from "./middleware/errorMiddleWare.js";
import { userModel, websiteSettingsModel } from "./Database/models.js";
import { AppSettingRouter } from "./Routes/appSetting.js";
import { promisesHandler } from "./middleware/promisesHandler.js";
import { send_mail, sendResponse } from "./utils/commonMethods.js";
import { ErrorHandlerClass } from "./utils/ErrorHandlerClass.js";
import { appName } from "./Handlers/orderHandlers.js";
import { contactMessageTemplate } from "./utils/htmlTemplates.js";

// import { get_ENV_Object } from "./utils/commonMethods.js";
// ==================================================
//    Declaring & Initializing Variables  
// ==================================================

const app = Express();
const Port = process.env.Port || 4555;
// ==================================================


// Handling uncaughtException
process.on("uncaughtException",(error)=>
{
  console.log("\nError Name:",error.name);
  console.log("Error Message:",error.message);
  console.log("\nError Stack:",error.stack);
  console.log("\nClosing Server: Due to uncaughtException\n");
  
  process.exit(1);
})


// ==================================================
//     Configration
// ==================================================
DbConnect();     // Connecting Database 



// ==================================================
//     Middlewares 
// ==================================================
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
app.use(cookieParser());        // Parsing Cookie
app.use(Express.json());        // Parsing Json
app.use("/image/",Express.static(Products_imagesFolderPath));      // creating products images static folder
app.use("/api/v1/product/",productRouter);      // creating productRouter entry point
app.use("/api/v1/user/",userRouter);      // user router, handle user related API's
app.use("/api/v1/order/",orderRouter);      // order Router 
app.use("/api/v1/setting/",AppSettingRouter);      // order Router 
app.post("/api/v1/contact/",promisesHandler(async (req,res,next)=>{
  
  const {name:userName,email,message} =req.body;

  if(!userName || !email || !message)
  {
              return next(new ErrorHandlerClass("Please! provide all the required fields",400));
    
  }
const adminContact = await userModel.findOne({role:"admin"});
await send_mail(
    `User Message - ${appName}`,
    adminContact.email,
    "Message from user!",
    contactMessageTemplate(userName,email,message,appName)
  );
return sendResponse(res,200,"Message sent successfully!",true);

}));      // order Router 

app.use("/",(req,res,next)=>{
    console.log(req.url,req.hostname,req.originalUrl);
    res.json({response:"Welcome Here\nServer is running without any issue.",status:true})
    next();
})
// ==================================================
//               Error Middleware            
// ==================================================
app.use(ErrorHandlerMiddleware);

(async () => {

  await websiteSettingsModel.ensureDefaults();
  await userModel.ensureDefaults();
})();

// ==================================================

app.listen(Port,(e)=>{
  if(e){console.log(e);}
  else{
    console.log(`App is Running at port no http://localhost:${Port}`);
  }
})
