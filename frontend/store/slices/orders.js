import { Fetch_Data } from "../../functions/methods";
import {OrdersAPI} from "../API/API_URL";
import { toast } from "react-toastify"



export const createProductOrder= async (data)=>
{
 const {url,method} = OrdersAPI.createOrder;
    const response = await Fetch_Data(url,method,true,data);

    console.log(response,"Create New order response");
    
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
export const getAllTheOrders= async ()=>
{
 const {url,method} = OrdersAPI.getAllOrder;
    const response = await Fetch_Data(url,method);

    console.log(response," response for all the orders api");
    
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
export const deleteOrderByID= async (id)=>
{
 const {url,method} = OrdersAPI.deleteOrderByID;
    const response = await Fetch_Data(url+id,method);

    console.log(response," response for DElete order api");
    
    if(response.success === true)
    {
         return true;

    }
    else 
    {
        toast.warn(response.msg);
        return false;

    }

}
export const changeOrderStatus= async (id,status)=>
{
 const {url,method} = OrdersAPI.changeOrderStatus;
    const response = await Fetch_Data(url+id,method,true,status);

    console.log(response," response for DElete order api");
    
    if(response.success === true)
    {
         return true;

    }
    else 
    {
        toast.warn(response.msg);
        return false;

    }

}