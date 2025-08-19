import Express from "express";
import {createOrder, getOrderByID,deleteOrderByID,getAllOrders,changeOrderStatus} from "../Handlers/orderHandlers.js";
import { Authenticator,isAccountVerified,verifyRoles } from "../middleware/authentication.js";

export const orderRouter = Express.Router();


orderRouter.route("/new").post(Authenticator,isAccountVerified,createOrder);

//Admin : Get All Order
orderRouter.route("/all").get(Authenticator,verifyRoles("admin"),getAllOrders)

//Admin : Change Order Status
orderRouter.route("/change-status/:id").patch(Authenticator,verifyRoles("admin"),changeOrderStatus);

//Admin : Get, Delete Single order by ID
orderRouter.route("/:id").get(Authenticator,verifyRoles("admin"),getOrderByID).delete(Authenticator,verifyRoles("admin"),deleteOrderByID);