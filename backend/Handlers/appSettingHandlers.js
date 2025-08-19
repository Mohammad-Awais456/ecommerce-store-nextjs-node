import { websiteSettingsModel } from "../Database/models.js";
import {promisesHandler} from "../middleware/promisesHandler.js";
import { ErrorHandlerClass } from "../utils/ErrorHandlerClass.js";
import mongoose from "mongoose";
import { isValidMongoDB_Obj_Id, sendResponse } from "../utils/commonMethods.js";



// Get All products
export const getAllSettings = promisesHandler(async (req,res)=>
  {
   

    const Settings = await websiteSettingsModel.find();
    // return sendResponse(res,200,response_message,true,allProducts,{"totalProductCount":product_feature_object.totalProducts});
    return sendResponse(res,200,"Settings found successfully.",true,Settings[0]);
   
  
  });
export const updateSettings = promisesHandler(async (req,res)=>
  {
   

       const settingsId = req.params.id;
        console.log(req.body);
        
        const IsSettingUpdated = await websiteSettingsModel.findByIdAndUpdate(settingsId,req.body,{new:true});
        
  
      if(!IsSettingUpdated)
        {
          return next(new ErrorHandlerClass("Settings Object Not Found!",404));
        }
    
    return sendResponse(res,200,"Setting Updated successfully.",true,IsSettingUpdated);
   
  
  });
export const updateSettings_plus_logo = promisesHandler(async (req,res)=>
  {
   

        const BodyData = req.body;
        if(!BodyData)
        {
           return sendResponse(res,200,"Please, provide all the fields.",false);

        }
        const currentSettings = await websiteSettingsModel.findOne();
        const logo = req.files.map(file => file.filename);
         currentSettings.siteTitle = BodyData.siteTitle;
         console.log(logo);
         if(logo.length !== 0)
         {

           currentSettings.logo = logo[0];
         }
         currentSettings.siteDescription = BodyData.siteDescription;
         
         await currentSettings.save();
       
  
   
    
    return sendResponse(res,200,"Setting Updated successfully.",true);
   
  
  });
