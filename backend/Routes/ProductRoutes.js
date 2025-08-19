import Express from "express";
import { 
    getAllProducts,
    removeProduct,
    createProductReview,
    get_Single_review_by_id,
    productByID,
    updateProduct,
    createProduct,
     getReviewByProduct_ID,
     remove_Single_review_by_id,
     getAllReviews_of_all_products,
     remove_all_reviews_of_specific_Product_by_id,
     approvedTheReview
     
     } 
     from "../Handlers/productHandlers.js";
import { Authenticator,isAccountVerified,verifyRoles } from "../middleware/authentication.js";
import { uploadProductImages } from "../middleware/multerConfig.js";

export const productRouter = Express.Router();



productRouter.route("/all").get(getAllProducts);
productRouter.route("/new").post(Authenticator,verifyRoles("admin"),uploadProductImages.array("images",10),createProduct);
// Reviews Related Routes
// Create Review
productRouter.route("/review").post(Authenticator,isAccountVerified,createProductReview);
// Get & Delete all reviews of specific product
productRouter.route("/reviews").get(Authenticator,getAllReviews_of_all_products)
productRouter.route("/reviews/:productId").get(getReviewByProduct_ID).delete(remove_all_reviews_of_specific_Product_by_id);
// Get & Delete single review by their ID
productRouter.route("/review/:reviewId").get(get_Single_review_by_id).patch(Authenticator,verifyRoles("admin"),approvedTheReview).delete(Authenticator,verifyRoles("admin"),remove_Single_review_by_id);
;

productRouter.route("/:id").patch(Authenticator,verifyRoles("admin"),uploadProductImages.array("images",10),updateProduct).delete(Authenticator,verifyRoles("admin"),removeProduct).get(productByID);