import mongoose from "mongoose";
import { productSchema,orderSchema, userSchema,productReviewsSchema, WebsiteSettingSchema} from "./schema.js";


export const userModel = new mongoose.model("users",userSchema);
export const ordersModel = new mongoose.model("orders",orderSchema);
export const productModel = new mongoose.model("products",productSchema);
export const productReviewsModel = new mongoose.model("productReviews",productReviewsSchema);
export const websiteSettingsModel = new  mongoose.model("WebsiteSetting", WebsiteSettingSchema);


userModel.createIndexes();