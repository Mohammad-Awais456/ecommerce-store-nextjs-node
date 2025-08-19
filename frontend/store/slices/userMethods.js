import { Fetch_Data } from "../../functions/methods";
// import {createAsyncThunk} from "@reduxjs/toolkit";
import { userAPI } from "../API/API_URL";
import { toast } from "react-toastify";



export const logout_User = async (data)=>
{
    const {url,method} = userAPI.logout;
    const response = await Fetch_Data(url,method,false);

    console.log(response,"this is the response");
    
    if(response.success === true)
    {
        return  {
            loginStatus:false,
            user:""
        }

    }
    else 
    {
        toast.warn(response.msg);
        return false;

    }

}
export const loginUser = async (data)=>
{
    const {url,method} = userAPI.login;
    const response = await Fetch_Data(url,method,true,data);

    console.log(response,"this is the response");
    
    if(response.success === true)
    {
        return  {
            loginStatus:true,
            user:response.data
        }

    }
    else 
    {
        toast.warn(response.msg);
        return false;

    }

}
export const registerUser = async (data)=>
{
    const {url,method} = userAPI.register;
    const response = await Fetch_Data(url,method,true,data);

    console.log(response,"this is the response");
    
    if(response.success === true)
    {
        return  {
            loginStatus:true,
            user:response.data
        }

    }
    else 
    {
        toast.warn(response.msg);
        return false;

    }

}
export const verifyAccount = async (data)=>
{
    const {url,method} = userAPI.verifyAccount;
    const response = await Fetch_Data(url,method,true,data);

    console.log(response,"this is the response");
    
    if(response.success === true)
    {
        return  true;

    }
    else 
    {
        toast.warn(response.msg);
        return false;

    }

}
export const requestToken = async (data)=>
{
    const {url,method} = userAPI.requestToken;
    const response = await Fetch_Data(url,method,true,data);

    console.log(response,"Requested token response");
    
    if(response.success === true)
    {
        return  true;

    }
    else 
    {
        toast.warn(response.msg);
        return false;

    }

}
export const resetPasswordMethod = async (data)=>
{
    const {url,method} = userAPI.resetPass;
    const response = await Fetch_Data(url,method,true,data);

    console.log(response,"Reset Password response");
    
    if(response.success === true)
    {
        return  true;

    }
    else 
    {
        toast.warn(response.msg);
        return false;

    }

}
export const updateProfileData = async (data)=>
{
    const {url,method} = userAPI.updateProfile;
    const response = await Fetch_Data(url,method,true,data);

    console.log(response,"Updated Profile response");
    
    if(response.success === true)
    {
         return  {
            loginStatus:true,
            user:response.data
        }

    }
    else 
    {
        toast.warn(response.msg);
        return false;

    }

}
export const DeleteUserByID = async (id)=>
{
    const {url,method} = userAPI.DeleteUser;
    const response = await Fetch_Data(`${url}${id}`,method);
                         
    console.log(response,"Deleted user  response");
    
    if(response.success === true)
    {
        toast.success(response.msg);
         return true;

    }
    else 
    {
        toast.warn(response.msg);
        return false;

    }

}
export const getAllTheUsersInfo = async ()=>
{
    const {url,method} = userAPI.AllUsersInfo;
    const response = await Fetch_Data(url,method);

    console.log(response,"Get all users  response");
    
    if(response.success === true)
    {
         return response.data;

    }
    else 
    {
        toast.warn(response.msg);
        return false;

    }

}


