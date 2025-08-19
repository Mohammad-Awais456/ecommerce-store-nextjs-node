import { productModel, productReviewsModel } from "../Database/models.js";
import {promisesHandler} from "../middleware/promisesHandler.js";
import { ErrorHandlerClass } from "../utils/ErrorHandlerClass.js";
import { apiFeatures } from "../utils/apiFeatures.js";
import mongoose from "mongoose";
import { isValidMongoDB_Obj_Id, sendResponse } from "../utils/commonMethods.js";
import fs from "fs";
import { fileURLToPath } from 'url';
import path from "path";


// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get All products
export const getAllProducts = promisesHandler(async (req,res)=>
  {
    // console.log();
    const result_per_page = 10;

    const product_feature_object = new apiFeatures(productModel.find(),req.query).search().filter();
    // product_feature_object.print();
    const allProducts = await  product_feature_object.query;
    let response_message = "Products found successfully.";
    if(allProducts.length ===0)
    {
      response_message = "Product not found.";
    }

    return sendResponse(res,200,response_message,true,allProducts,{"totalProductCount":product_feature_object.totalProducts});
    // return  res.json({success:true,data:allProducts,productCount:product_feature_object.totalProducts});
  
  });

  // Get single Product by ID
export const productByID = promisesHandler ( async (req,res,next)=>
  {
  
      const productId = req.params.id;
   
      if(!isValidMongoDB_Obj_Id(productId))
      {
        return next(new ErrorHandlerClass("Invalid Product ID!",400));

      }



      const singleProduct = await productModel.findOne({_id:productId});
      // console.log(singleProduct);


      if(!singleProduct)
      {
        return next(new ErrorHandlerClass("Product is not found!",404));
      }
      
    // await  productModel.create(req.body);
    return sendResponse(res,200,"Product is found successfully!",true,singleProduct);
  
    
  
    
  })
  // Remove Products --Admin --
export const removeProduct = promisesHandler(async (req, res, next) => {
  const productId = req.params.id;
  const removedProduct = await productModel.findByIdAndDelete(productId);

  if (!removedProduct) {
    return next(new ErrorHandlerClass("Product is not found!", 404));
  }

  // Delete each image file from uploads folder
  if (removedProduct.gallery && Array.isArray(removedProduct.gallery.images)) {
    removedProduct.gallery.images.forEach((fileName) => {
      const filePath = path.join(process.cwd(), "uploads/products", fileName); // adjust 'uploads' to your actual folder
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete file: ${fileName}`, err);
        } else {
          console.log(`Deleted file: ${fileName}`);
        }
      });
    });
  }

  return sendResponse(res, 200, "Product deleted successfully!", true);
});
  // Update Products --Admin --
export const updateProduct = promisesHandler(async (req, res, next) => {
  const productId = req.params.id;

  // Find product first so we can merge old/new images
 
  if (!req.body) {
    return next(new ErrorHandlerClass("No changes detected!", 404));
  }
 
// console.log(req.body,"body updated product data");

// Parse fields from request body
const NewimageNames = req.files.map(file => file.filename);

// featuredImage comes from frontend (index)
const featuredIndex = req.body.featuredImage || 0;

     let updatedImages=[];
     const exitedImages = req.body.existingImages;
     console.log(exitedImages,"prevoius images");
     
     if(exitedImages !== undefined )
      {
        if(typeof exitedImages ==="string")
        {

          updatedImages.push(exitedImages)
        }else
          {
          updatedImages =[...exitedImages]

        }
      }
      if(NewimageNames !== undefined )
        {
      updatedImages =[...updatedImages,...NewimageNames]

    }
    const updatedGallery = {
   
            images: updatedImages,
            featuredImage: featuredIndex
        }
      



console.log(updatedGallery,"new images names");
  // return res.json({"ok":"ok"})

  // Ensure existingImages is an array
  // if (!Array.isArray(existingImages)) {
  //   existingImages = existingImages ? [existingImages] : [];
  // }

  // Handle new uploaded files (via multer)
  // const uploadedFiles = req.files || [];
  // const newImageNames = uploadedFiles.map(file => file.filename);

  // Merge old + new images
  // const finalImages = [...existingImages, ...newImageNames];

  // Optional: Delete removed images from disk
  // const removedImages = product.gallery.images.filter(img => !existingImages.includes(img));
  // removedImages.forEach(img => {
  //   const filePath = path.join(__dirname, "../uploads/products", img);
  //   fs.unlink(filePath, err => {
  //     if (err) console.error(`Failed to delete image: ${img}`, err);
  //   });
  // });

  // Update product in DB
 
  const updatedProduct = await productModel.findByIdAndUpdate(
    productId,
 {
  ...req.body,
  ...(exitedImages !== undefined 
      ? { gallery: updatedGallery } 
      : {})
},
    { new: true }
  );

  return sendResponse(res, 200, "Product updated successfully!", true, updatedProduct);
});

  // Create New Products --Admin --
// export const createProduct = promisesHandler ( async (req,res,next)=>
//   {
  
//     req.body.createdBy = req.user._id;

//       console.log(req.body);
  
//     const newProductData = await  productModel.create(req.body);
  
  
//     sendResponse(res,201,"Product created successfully!",true,newProductData);
  
    
//   })
export const createProduct = promisesHandler(async (req, res, next) => {
    req.body.createdBy = req.user._id;

    // Map uploaded files to just filenames
    console.log( req.files,"uploaded files");
    console.log( req.body,"body data");
    
    const imageNames = req.files.map(file => file.filename);

    // featuredImage comes from frontend (index)
    const featuredIndex = req.body.featuredImage || 0;

    const productData = {
        ...req.body,
        gallery: {
            images: imageNames,
            featuredImage: featuredIndex
        }
    };

    const newProduct = await productModel.create(productData);

    sendResponse(res, 201, "Product created successfully!", true, newProduct);
});


// Create New Review - Only Login Users have access
export const createProductReview = promisesHandler(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const { name: user } = req.user;

  // Validate input
  if (!rating || !comment || !productId) {
    return next(
      new ErrorHandlerClass(
        "Provide all the necessary fields for review. (rating, comment, productId).",
        400
      )
    );
  }

  if (!isValidMongoDB_Obj_Id(productId)) {
    return next(new ErrorHandlerClass("Provide valid productId id!", 400));
  }

  // 1. Create new review
  const newReview = await productReviewsModel.create({
    comment,
    rating,
    productId,
    user
  });
  console.log(newReview);

  

  // 5. Send response
  sendResponse(res, 201, "Product review created successfully, just wait for admin to approve it!", true);
});

// Get Single review by their id
export const get_Single_review_by_id = promisesHandler(async (req,res,next)=>{

   const {reviewId} = req.params;
   if(!reviewId)
   {
    return next(new ErrorHandlerClass("Provide review id!",400));

   }
   if(!isValidMongoDB_Obj_Id(reviewId))
    {
    return next(new ErrorHandlerClass("Provide valid review id!",400));

  }
   const SingleReviews= await productReviewsModel.findOne({_id:reviewId}).populate('user','name');
  //  console.log(reviewId,productReviews);
  
 


  return sendResponse(res,200,"Review fetched successfully!",true,SingleReviews);
  


})


///////////////// update the product rating /////////////////
const updateTheProductRating = async (productId)=>
{
  
// 2. Fetch all approved reviews for this specific product
const approvedReviews = await productReviewsModel.find({
  productId: productId,
  approved: true
});

// 3. Calculate average rating (avoid division by zero)
let avgRating = 0;
if (approvedReviews.length > 0) {
  avgRating =
    approvedReviews.reduce((sum, review) => sum + review.rating, 0) /
    approvedReviews.length;
}

// 4. Update product rating
await productModel.findByIdAndUpdate(productId, {
  rating: avgRating.toFixed(1) // store with 1 decimal place
});
}
///////////////// update the product rating /////////////////

// Update Single review by their id
export const approvedTheReview = promisesHandler(async (req,res,next)=>{

   const {reviewId} = req.params;
   const approvdedState = req.body.approved;
   if(approvdedState=== undefined)
   {
    return next(new ErrorHandlerClass("Please, provide approved field!",400));

   }

   if(!reviewId)
   {
    return next(new ErrorHandlerClass("Provide review id!",400));

   }
   if(!isValidMongoDB_Obj_Id(reviewId))
    {
    return next(new ErrorHandlerClass("Provide valid review id!",400));

  }

// 1. Update review by ID and get the updated document
const updatedReview = await productReviewsModel.findByIdAndUpdate(
  req.params.reviewId,                  // <-- review ID from URL params
  { approved: approvdedState},
  { new: true }                         // return the updated review
);

if (!updatedReview) {
  return sendResponse(res,404,"Review not found!",false);

}

const productId = updatedReview.productId; // get the related product ID

await updateTheProductRating(productId);

  return sendResponse(res,200,"Review Updated!",true);
  


})
// Admin---- Get all REview of all products
export const getAllReviews_of_all_products = promisesHandler(async (req,res,next)=>{

   
  
   const AllReviews= await productReviewsModel.find({});
 
  
 


  return sendResponse(res,200,"Review fetched successfully!",true,AllReviews);
  


})
// Delete Single review by their id
export const remove_Single_review_by_id = promisesHandler(async (req,res,next)=>{

   const {reviewId} = req.params;
   if(!reviewId)
   {
    return next(new ErrorHandlerClass("Provide review id to delete it!",400));

   }
   if(!isValidMongoDB_Obj_Id(reviewId))
    {
    return next(new ErrorHandlerClass("Provide valid review id!",400));

  }
   const deleteReviewResponse= await productReviewsModel.findOneAndDelete({_id:reviewId});
  //  console.log(reviewId,productReviews);


 if(!deleteReviewResponse)
  {
    return next(new ErrorHandlerClass("Review not found!",404));

  }
  else
  {

    await updateTheProductRating(deleteReviewResponse.productId);
  }
 


  return sendResponse(res,200,"Review deleted successfully successfully!",true,deleteReviewResponse);
  


})
// Get alll reviews of the specific product
export const getReviewByProduct_ID = promisesHandler(async (req,res,next)=>{

   const {productId} = req.params;
 
   if (!productId) 
     {  
       return next(new ErrorHandlerClass("Please, Provide product ID to get reviews.",400));
     }
   if(!isValidMongoDB_Obj_Id(productId))
    {
    return next(new ErrorHandlerClass("Provide valid product id!",400));

  }
   const productReviews = await productReviewsModel.find({
  productId: productId,
  approved: true
});

   console.log(productId,productReviews);
  


  return sendResponse(res,200,"Reviews fetched successfully!",true,productReviews);
  


})
// Remove alll reviews of the specific product
export const remove_all_reviews_of_specific_Product_by_id = promisesHandler(async (req,res,next)=>{

   const {productId} = req.params;
 
   if (!productId) 
     {  
       return next(new ErrorHandlerClass("Please, Provide product ID to remove their reviews.",400));
     }
   if(!isValidMongoDB_Obj_Id(productId))
    {
    return next(new ErrorHandlerClass("Provide valid product id!",400));

  }
   const all_Removed_productReviews= await productReviewsModel.deleteMany({product:productId});
  //  console.log(productId,productReviews);
  if(all_Removed_productReviews.deletedCount === 0)
    {
      return next(new ErrorHandlerClass("Not a single review found about this product!",404));
  
    }
   


  return sendResponse(res,200,"Reviews fetched successfully!",true,all_Removed_productReviews);
  


})


