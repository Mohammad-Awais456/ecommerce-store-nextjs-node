import { Fetch_Data } from "../../functions/methods";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {productAPI} from "../API/API_URL";
import { toast } from "react-toastify";


// export const fetchAllProducts = createAsyncThunk("product/all",async ()=>
//     {
//         const productData = await Fetch_Data(productAPI.getAll.url,productAPI.getAll.method);      
//             console.log(productData);
            
//         return productData.data;
        
    
//     })
export const getAllProducts = async (query={})=>
{
    const {url,method} = productAPI.getAllProducts;
     const queryString = new URLSearchParams(query).toString();
     console.log(`${url}?${queryString}`, "this is original search query");
     
    const response = await Fetch_Data(`${url}?${queryString}`,method);

    // console.log(response,"Get all products response");
    
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
export const getProductByID = async (id)=>
{
    const {url,method} = productAPI.getProductByID;
    const response = await Fetch_Data(url+id,method);

    console.log(response,"Product by id response");
    
    if(response.success === true)
    {
         return response.data;

    }
    else 
    {
        return false;

    }

}
export const getAllProductReviews = async (id)=>
{
    const {url,method} = productAPI.getAllReviews;
    const response = await Fetch_Data(url+id,method);

    console.log(response,"All Product Reviews by id response");
    
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
export const getAll_review_of_all_products = async ()=>
{
    const {url,method} = productAPI.getAllReviews;
    const response = await Fetch_Data(url,method);

    console.log(response,"All Reviews of all products response");
    
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
export const CreateNewReview = async (data)=>
{
    const {url,method} = productAPI.createNewReview;
    const response = await Fetch_Data(url,method,true,data);

    console.log(response,"Create New review response");
    
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
export const createNewProduct = async (formData) => {
    const { url, method } = productAPI.createNewProduct;

    const response = await fetch(url, {
        method,
        body: formData, // send FormData directly
        credentials: "include", 
        // do NOT set headers manually
    });

    const resData = await response.json();
    console.log(resData, "new product creation response");

    if (resData.success) {
        toast.success(resData.msg);
        return true;
    } else {
        toast.warn(resData.msg);
        return false;
    }
};

export const updateSingleProductByID = async ( id,formData) => {
    const { url, method } = productAPI.updateProductByID;
console.log(formData,"sending DAta");

    const response = await fetch(url + id, {
        method,
        body: formData, // send FormData directly
        credentials: "include", 
        // don't manually set Content-Type when sending FormData
    });

    const resData = await response.json();
    console.log(resData, "Updated product response");

    if (resData.success) {
        toast.success(resData.msg);
        return true;
    } else {
        toast.warn(resData.msg);
        return false;
    }
};
export const updateReviewApprovedState = async ( id,data) => {
    const { url, method } = productAPI.updateReviewApprovedState;

    
    const response = await Fetch_Data(url+id,method,true,data);

   

    if (response.success) {
        toast.success(response.msg);
        return true;
    } else {
        toast.warn(response.msg);
        return false;
    }
};
export const deleteProductReviewByid = async ( id) => {
    const { url, method } = productAPI.deleteProductReviewByid;

    
    const response = await Fetch_Data(url+id,method);

   

    if (response.success) {
        toast.success(response.msg);
        return true;
    } else {
        toast.warn(response.msg);
        return false;
    }
};

export const DeleteSingleProductByID = async (id)=>
{
    const {url,method} = productAPI.DeleteProductByID;
    const response = await Fetch_Data(url+id,method);

    console.log(response,"Delete product response");
    
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
