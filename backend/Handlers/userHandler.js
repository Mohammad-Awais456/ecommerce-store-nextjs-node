import { ordersModel, userModel } from "../Database/models.js";
import { ErrorHandlerClass } from "../utils/ErrorHandlerClass.js";
import {promisesHandler} from "../middleware/promisesHandler.js";
import { generateRandomCode, GetVerificationToken, isExpired, isValidMongoDB_Obj_Id, send_mail, sendResponse } from "../utils/commonMethods.js";
import jsonwebtoken from "jsonwebtoken";
import validator from "validator";

import { codeVerificatonTemplate } from "../utils/htmlTemplates.js";
import { appName } from "./orderHandlers.js";


// User Registeration Function
export const registerUser = promisesHandler(async (req,res,next)=>{

// console.log(req.body);

const {email,password,username,name} = req.body;

    if(!email || !password || !username || !name)
    {
     return next(new ErrorHandlerClass("Plese, fill all the fields",400));
    }
    
    const newUser = await userModel.create({
        name,password,username,email
    });

    if (newUser) {

      // Generating new token and storing in user tokens array.
      const getToken = await newUser.generateJWT_Token();
    
      if(!getToken) // if token not generated
        {return next(new ErrorHandlerClass("Token Generation Error - At Creation Module!",500));}

        // Code for Sending Verification Token to the User
        const SixDigit_token_obj = GetVerificationToken();
        newUser.verificationToken = SixDigit_token_obj;
        await newUser.save();
        
        const mail_response = await send_mail(
          `${appName} <${process.env.MAILR_USER_NAME}>`,
          newUser.email,
          "Verify Your Account - "+appName,
          codeVerificatonTemplate(SixDigit_token_obj.token,appName)
        );
     
    
    
      console.log(mail_response);


const cookie_information = {    


  name:"loginToken",
  value:getToken

}
// res.status(201).json({success:true,user:newUser});
return sendResponse(res,201,"New Account Created Successfully!",true,newUser,`Please, check your email (${newUser.email}), 6 digit verification code has been sent.`,cookie_information);
}

})


// ========== user login method ==============
export const loginUser = promisesHandler(async (req,res,next)=>{

const {password,username} = req.body;

// insuring that field should not empty!
if(!password || !username)
  {
    return next(new ErrorHandlerClass("Please, fill all the fields",400));
  }

// Creating Filter Query for chechking that user exits or not

const searchQuery = {$or:[{email:username},{username}]};

// geting user information
const user = await userModel.findOne(searchQuery).select("+password"); 

if(!user) // if user not found
  {return next(new ErrorHandlerClass("User Name or Password is invalid!",401));}

// compare password
const isPasswordMatched = await user.comparePassword(password);

if(!isPasswordMatched) // if password wrong
  {return next(new ErrorHandlerClass("Username or Password is invalid!",401));}
else // if password correct 
{


  // Generating new token and storing in user tokens array.
  const getToken = await user.generateJWT_Token();

  if(!getToken) // if token not generated
    {return next(new ErrorHandlerClass("Token Generation Error!",500));}

    await user.save();  // saving updated tokens key in user object

      
    
   


const cookie_information = {
  name:"loginToken",
  value:getToken

}

user.password="";
const tempUser = user;

return sendResponse(res,200,"Login Successfully!",true,tempUser,null,cookie_information);
}

})

export const isLogin = promisesHandler(async (req,res,next)=>{

  const userData = req.user;

  return sendResponse(res,200,`Yes, ${userData.name} is signed in.`,true,userData);



})
// =================================================================================
// Check username or email exists in the database
export const isUserExists = promisesHandler(async (req,res,next)=>{

  const user_data = req.body;

  const is_email_included = user_data.email? true:false;
  const is_username_included = user_data.username? true:false;
  let responseData = {username:false,email:false};

  const response_messages = 
  {
      bothExists: "Username & Email both exits in database.",
      username:"Only Username exists in database",
      email:"Only Email exists in database"
  }
   


  if(!is_email_included && !is_username_included)
  {
    return next(new ErrorHandlerClass("Please, provide username or email to check it's existence!",400));
  }
  

  if(is_username_included)
    {
    const isUserNameExists = await userModel.findOne({"username":user_data.username});
    if(isUserNameExists)
      {
         responseData.username = true;
      }
  
  }
  if(is_email_included)
  {
    const isEmailExists = await userModel.findOne({"email":user_data.email});
    if(isEmailExists)
      {
         responseData.email = true;
      }
  }

 const finalResponseMessage = (responseData.email && responseData.username)? response_messages.bothExists:responseData.email?response_messages.email:responseData.username?response_messages.username:"Email or Username not found in database!";



return sendResponse(res,200,finalResponseMessage,true,responseData,null,null);
  
  })
// Verify Account By Six Digit Token
export const verfiyAccount = promisesHandler(async (req,res,next)=>
{

  const {token:tokenFromUser} =  req.body;
  const userData = req.user;
  const {verified:isVerified,email:unverifiedEmail,verificationToken}=userData;
    console.log(verificationToken, "is it's exists");
    
  if(!tokenFromUser)
    {
      return next(new ErrorHandlerClass("Please, provide token for verificatoin!",400));
    }
  if(isVerified)
    {
      return next(new ErrorHandlerClass("Account Already Verified",400));
  
    }
  if(!unverifiedEmail)
    {
      return next(new ErrorHandlerClass("Email does't exists!",400));
  
    }
  if(!verificationToken.token)
    {
      return next(new ErrorHandlerClass("Six digit code Don't exists, request a new 6 digit code!",400));

    }
  if(isExpired(verificationToken.expiry))
    {
      return next(new ErrorHandlerClass("Verification Code already expired. Please, request a new 6 digit code",400));

    }    
  if(tokenFromUser !== verificationToken.token)
    {
      return next(new ErrorHandlerClass("Invalid code! Please, provide correct code.",400));

    }   
    if(tokenFromUser === verificationToken.token)
    {
      userData.verified = true;
      await userData.save();

      return sendResponse(res,200,"Account verified successfully!",true);
    }
    else
    {
      return next(new ErrorHandlerClass("Something wrong! Account verificatoin process can't complete, please contact the support team.",500));
    }




})  
// Request Email,   ================ Forget Email & Find it ===============
export const findLostEmail = promisesHandler( async (req,res,next)=>{
  const {username} = req.body;
  if(!username)
  {
    return next(new ErrorHandlerClass("Please, provide username to find your email!",400));
  }
  const userData = await userModel.findOne({username});
  // console.log(userData,"ssdfsdf");
  
  if(!userData)
    {
      
       return next(new ErrorHandlerClass(`Username: ${username} does't belong to any account.`,200));

      
      
    }
    
    return sendResponse(res,200,`Is this your email: ${userData.email}`,true,userData.email);


})
//    ================ Reset Password ===============
export const resetPassword = promisesHandler( async (req,res,next)=>{
  const {username,token:userProvidedToken,password:updatedPassword} = req.body;
  if(!userProvidedToken)
  {
    return next(new ErrorHandlerClass("Please, provide 6 digit code to verify your request!",400));

  }
  if(!username)
  {
    return next(new ErrorHandlerClass("Please, provide email or username to find your account!",400));
  }
  if(!updatedPassword)
  {
    return next(new ErrorHandlerClass("Please, provide new password!",400));
  }
  const isEmail = validator.isEmail(username);
  const searchQuery = {$or:[{email:username},{username}]};

  const userData = await userModel.findOne(searchQuery);
  
 
    if(!userData)
    {
      return isEmail?      
       next(new ErrorHandlerClass(`Email: ${username} does't belong to any account.`,400))
       :
       next(new ErrorHandlerClass(`Username: ${username} does't belong to any account.`,400));
      
      
    }
    
    // if user exits then fetch token 
    const {verificationToken} = userData;

    if(!verificationToken.token)
      {
        return next(new ErrorHandlerClass("Six digit code Don't exists, request a new 6 digit code!",400));
  
      }
    if(isExpired(verificationToken.expiry))
      {
        return next(new ErrorHandlerClass("Verification Code already expired. Please, request a new 6 digit code",400));
  
      }    
    if(userProvidedToken !== verificationToken.token)
      {
        return next(new ErrorHandlerClass("Provided Code does't match.",400));
  
      }   
      if(userProvidedToken === verificationToken.token)
      {
        if(!updatedPassword)
        {
        return sendResponse(res,200,"Code Match Successfully!, Please, Provide Updated Password",true);

        }
                userData.password = updatedPassword;
                console.log(userData);
                
                userData.verificationToken = {};
                await userData.save();

        return sendResponse(res,200,"Password Successfully Updated.",true);
      }
      else
      {
        return next(new ErrorHandlerClass("Something wrong! Password Reset verificatoin process can't complete, please contact the support team.",500));
      }


})
// Send Verification Token
export const sendVerificationToken= promisesHandler(async (req,res,next)=>{


  const {username} = req.body;

  if(!username)
    {
      return next(new ErrorHandlerClass("Please, provide username or email to request verification code!",400));
    }

  const isEmail = validator.isEmail(username);
  const searchQuery = {$or:[{email:username},{username}]};

  const userData = await userModel.findOne(searchQuery);
  // console.log(userData,"ssdfsdf");
  
  if(!userData)
    {
      return isEmail?      
       next(new ErrorHandlerClass(`Email: ${username} does't belong to any account.`,400))
       :
       next(new ErrorHandlerClass(`Username: ${username} does't belong to any account.`,400));
      
      
    }
    const token_obj = GetVerificationToken();
    userData.verificationToken = token_obj;

    await userData.save();

    const mail_response = await send_mail(
     `${appName} <${process.env.MAILR_USER_NAME}>`,
      userData.email,
       "Verify Your Account - "+appName,
      codeVerificatonTemplate(token_obj.token,appName)
    );
     
     


  console.log(mail_response);

  
return sendResponse(res,200,`Please, check your email (${userData.email}), 6 digit verification code has been sent.`,true);
  

})  
// user Logout method
export const logoutUser = promisesHandler(async (req,res,next)=>{

  console.log(req.cookies);
  const User_Token = req.cookies.loginToken;
  

  if (!User_Token)
    { return next(new ErrorHandlerClass("Invalid Request! Token Not Found!",404)); }

  // console.log(User_Token);

  const get_token_data = jsonwebtoken.verify(User_Token,process.env.JWT_SECRET_KEY);

  // console.log(get_token_data);
  const get_user_data = await userModel.findOne({_id:get_token_data._id});
  console.log(get_user_data);

// Removing token from client side
const cookie_information = {
  name:"loginToken",
  value:"",
  maxAge:0

}

//===============================

// if user found in databse
  if (!get_user_data)
  {
    
    return sendResponse(res,200,"Invalid Token! User not found!",true,null,null,cookie_information);

  
  }

   // if user get found in database

  const temp_tokens = [...get_user_data.tokens];

  if(temp_tokens.length !== 0)
  {

    const new_tokens = temp_tokens.filter((ele)=> ele !== User_Token );
    get_user_data.tokens = new_tokens;
    await get_user_data.save();
    console.log(new_tokens);
  }

return sendResponse(res,200,"Logout Successfully!",true,null,null,cookie_information);
  
  })
// Update User Profile
export const UpdateProfile = promisesHandler(async (req,res,next)=>{

  const current_userInfo = req.user;
    const {name:new_name}= req.body;
    if(!new_name)
    {
      return next(new ErrorHandlerClass("Please, provide name to update your profile!",400));
    }
    current_userInfo.name = new_name;
    await current_userInfo.save();



return sendResponse(res,201,"Profile Updated Successfully!",true,current_userInfo);
  
  })

  // =================================================================================
// Check Get All the Users Information


export const deleteUser = promisesHandler(async (req, res, next) => {
  const { id: userId } = req.params;
  
  console.log("userid "+userId);
  
  if (!isValidMongoDB_Obj_Id(userId)) {
    return next(new ErrorHandlerClass("Invalid user ID!", 400));
  }

  // 1. Delete user
  const deletedUser = await userModel.findOneAndDelete({ _id: userId });

  if (!deletedUser) {
    return next(new ErrorHandlerClass("User not found!", 404));
  }

  // 2. Delete user's orders
  const deletedOrders = await ordersModel.deleteMany({ user: userId });

  console.log(`Deleted user: ${deletedUser.username}`);
  console.log(`Deleted orders count: ${deletedOrders.deletedCount}`);

  return sendResponse(
    res,
    200,
    `User ${deletedUser.name}'s account and ${deletedOrders.deletedCount} order(s) deleted successfully.`,
    true,
    { deletedUser, deletedOrders }
  );
});

// Check Get All the Users Information
export const getAllUser = promisesHandler(async (req, res, next) => {
  const users = await userModel
  .find(
      { role: { $ne: "admin" } }, // exclude admin users
      "username email name _id role createdAt verified"
    )
    .lean();

  return sendResponse(
    res,
    200,
    "Users fetched successfully",
    true,
    users,
    null,
    null
  );
});