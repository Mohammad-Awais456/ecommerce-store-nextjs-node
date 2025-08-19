import { Fetch_Data } from "../../functions/methods";
import {GlobalSettingsAPI} from "../API/API_URL";
import { toast } from "react-toastify"


export const getAllSettings = async ()=>
{
    const {url,method} = GlobalSettingsAPI.getAllSetting;
    const response = await Fetch_Data(url,method);

    console.log(response,"Get all Settings response");
    
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
export const UpdateAllSettingsFromDatabase = async (data)=>
{
    const {url,method} = GlobalSettingsAPI.updateSetting;
        const {id, updatedFields} = data;
    const response = await Fetch_Data(url+id,method,true,updatedFields);

    console.log(response," Settings Updated response");
    
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
export const updateLogoandOtherSetthings = async (formData)=>
{
    const {url,method} = GlobalSettingsAPI.updateLogoSetting;

    const response = await fetch(url, {
        method,
        body: formData, // send FormData directly
        credentials: "include", 
        // do NOT set headers manually
    });

    const resData = await response.json();
     console.log(resData,"admin settings api response");
     
    if(resData.success === true)
    {
        toast.success(resData.msg);
         return resData.data;

    }
    else 
    {
        toast.warn(resData.msg);
        return false;

    }

}