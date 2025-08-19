import { ordersModel, userModel } from "../Database/models.js";
import { ErrorHandlerClass } from "../utils/ErrorHandlerClass.js";
import {promisesHandler} from "../middleware/promisesHandler.js";
import { generateRandomCode, GetVerificationToken, isExpired, isValidMongoDB_Obj_Id, send_mail, sendResponse } from "../utils/commonMethods.js";
import jsonwebtoken from "jsonwebtoken";
import validator from "validator";

export const appName = "Nexacart";

import { codeVerificatonTemplate, orderConfirmationTemplate, orderStatusChangedTemplate } from "../utils/htmlTemplates.js";

export const createOrder = promisesHandler(async (req, res, next) => {
  const {
    shippingInfo,
    totalPrice,
    orderItems,
    paymentType // optional, defaults to "cod"
  } = req.body;

  // Create new order
  const createNewOrder = await ordersModel.create({
    shippingInfo,
    totalPrice,
    orderItems,
    paymentType, // if not provided, schema default "cod" will be used
    user: req.user._id
  });

  // Send confirmation email
  send_mail(
    `"Order Confirmaton - ${appName}" <${process.env.MAILR_USER_NAME}>`,
    req.user.email,
    "Your order was successfully placed!",
    orderConfirmationTemplate(shippingInfo.personName,orderItems,appName)
  );

  return sendResponse(
    res,
    201,
    "Order Created Successfully",
    true,
    createNewOrder
  );
});


// Get order by id - Admin
export const getOrderByID = promisesHandler(async (req,res,next)=>{

  const {id:orderID} = req.params;
  if (!orderID) 
  {   return next(new ErrorHandlerClass("Please, provide order id to get it!",400));
  }

  if(!isValidMongoDB_Obj_Id(orderID))
    {
      return next(new ErrorHandlerClass("Invalid order ID!",400));

    }

  const getOrderDetails = await ordersModel.findOne({"_id":orderID}).populate("user","name email");
  if (!getOrderDetails) 
    {   return next(new ErrorHandlerClass("Order does not exists!",404));
    }
  return sendResponse(res,200,"Order fetched successfully!",true,getOrderDetails);

})
// Delete order by id - Admin
export const getAllOrders = promisesHandler(async (req,res,next)=>{


    const getAllOrdersDetials = await ordersModel.find().populate("user", "name");;

  
      // if(getAllOrdersDetials.length ===0)
      //   {
      // return next(new ErrorHandlerClass("There are not any order exists!",404));

      // }

   
   console.log(getAllOrdersDetials);
   

  return sendResponse(res,200,"Orders fetched successfully!",true,getAllOrdersDetials);

})
// Change Order Status - Admin
export const changeOrderStatus = promisesHandler(async (req,res,next)=>{

  const {id:orderID} = req.params;
  const {orderStatus} = req.body;
  if (!orderStatus)
    {
      return next(new ErrorHandlerClass("Please, provide order status!",400));

    } 
  if (!orderID) 
  {   
    return next(new ErrorHandlerClass("Please, provide order id to change the status!",400));
  }

  if(!isValidMongoDB_Obj_Id(orderID))
    {
      return next(new ErrorHandlerClass("Invalid order ID!",400));

    }
    const orderDetails = await ordersModel.findOne({"_id":orderID});

    if (!orderDetails) 
      {   return next(new ErrorHandlerClass("This order does not exists!",404));
      }
   
      orderDetails.orderStatus = orderStatus;
           
      await orderDetails.save();
      const userData = await userModel.findOne({_id:orderDetails.user});
      if(userData)
      {

        // Send confirmation email
        send_mail(
          `Order Status Change - `+appName,
          userData.email,
          "Your order status change!",
          orderStatusChangedTemplate(orderDetails.shippingInfo.personName,orderDetails._id,orderStatus,appName)
        );
      }


  return sendResponse(res,200,"Order Status Updated successfully!",true,orderDetails);

})
// Delete order by id - Admin
export const deleteOrderByID = promisesHandler(async (req,res,next)=>{

  const {id:orderID} = req.params;
  if (!orderID) 
  {   return next(new ErrorHandlerClass("Please, provide order id to get it!",400));
  }

  if(!isValidMongoDB_Obj_Id(orderID))
    {
      return next(new ErrorHandlerClass("Invalid order ID!",400));

    }
    const getDeletedOrderDetails = await ordersModel.findOneAndDelete({"_id":orderID});
    


    if (!getDeletedOrderDetails) 
      {   return next(new ErrorHandlerClass("This order does not exists!",404));
      }

   
   

  return sendResponse(res,200,"Order fetched successfully!",true,getDeletedOrderDetails);

})