// "use client";
import { useRouter } from 'next/router';
import Banner from '../../components/Banner/Banner';
import style from '../../styles/singleProduct.module.scss';

import { CreateClasses, formatMongoDateToWords } from '../../functions/methods';
import { StarRating } from '../../components/common/StarRating';
import ProductQuantityToggler from '../../components/common/ProductQuantityToggler/ProductQuantityToggler';
import { useEffect, useState } from 'react';
import { CreateNewReview, getAllProductReviews, getAllProducts, getProductByID } from '../../store/slices/productMethods';
import { BackEndServerImagePath } from '../../store/API/API_URL';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addProductToCart } from '../../store/slices/cart';

function SingleProduct() {

   const router = useRouter();
   const dispatch = useDispatch();
   
     const {productId} = router.query;
    const userState = useSelector((state)=>state.user);
    const cartState = useSelector((state)=>state.cart);
     const NewReviewTemplate ={
      rating:0,
      comment:"",
      productId
     }
     const [newReview,setNewReveiw]=useState(NewReviewTemplate);
     const [productInfo,setProductInfo]=useState(false);
     const [ProductQuantity,setProductQuantity]=useState(1);
     const [productReviews,setProductReviews]=useState([]);
     const [productImages,setProductImages]=useState({active:0,images:[]});
     
    
     const productQuantityManager = (type)=>
    
     {

      if(type==="increment")
        {
          setProductQuantity( ProductQuantity + 1);
          
        }
        else if(type==="decrement" && ProductQuantity !== 1)
          {
         setProductQuantity( ProductQuantity - 1);

       }
     }
     function handleAddToCart()
     {
         if(userState.loginStatus !== true) return toast.info("You need to sign in before adding products to your cart.")
       
       
        const cartProductData = {
          productId,
          quantity:ProductQuantity,

        }

        console.log(cartProductData,"these added to cart");
        
      
      dispatch(addProductToCart(cartProductData));

        setProductQuantity(1);
        toast.success("Product added to cart sucessfully!");
        
        
      
     }
     const handleReviewSubmision = async ()=>
     {
      if(newReview.rating==0)
      {
      return  toast.warning("Please, select rating for the review.");
      }
      else if(!newReview.comment)
        {
        return toast.warning("Please, write the comment");

      }
      
        const res = await CreateNewReview({...newReview,productId:productId});
        if(res === true)
        {
             setNewReveiw(NewReviewTemplate);
             displayProductInfo();

        }
      


     }
     const HandleRatingChanged = (rating)=>
     {
         setNewReveiw({...newReview,rating})
     }
     const displayProductReviews= async () =>
     {
      
        

         const productReviews = await getAllProductReviews(productId);
         console.log(productReviews,"product info from product page");
         
         if (productReviews !== false) 
          {
              setProductReviews(productReviews)
        
          
         }
      
     }
     const displayProductInfo= async () =>
     {
        console.log(productId,"this is product id");
        

         const productData = await getProductByID(productId);
         console.log(productData,"product info from product page");
         
         if (productData !== false) 
          {
                 setProductInfo(productData)
          setProductImages({images:productData.gallery.images,active:productData.gallery.featuredImage})
          
         }
         else
         {
          router.push("/shop");
         }
  displayProductReviews();

     }

 useEffect(() => {

  if (!router.isReady) return;

  displayProductInfo();

}, [router.isReady]);


  if(!productInfo)
  {
    return 
      <>
      </>
  }
  else 
  {

  return (
    <>
    <Banner customBreadCrumb={productInfo.name}  heading1={false} title={productInfo.name} />
     <main className={CreateClasses("container mt-3",style.single_productPage_container)}>
       

       <section className={CreateClasses(style.product_image_and_price_container)}>

       <div className={CreateClasses(style.product_preview_container)}>

        <figure className={style.active_preview_container}>
          <img src={BackEndServerImagePath+productImages.images[productImages.active]} alt="product preview" />
        </figure>
        <div className={style.product_all_previewes_list}>
{

     productImages.images.map((imagesLinks,index)=><>
          <figure onClick={()=>setProductImages({...productImages,active:index})}  key={index} className={CreateClasses(style.product_preview_item, index === productImages.active? style.active:"")}>
            <img src={BackEndServerImagePath+imagesLinks} alt={imagesLinks} />
          </figure>
          
</>)

}


        </div>

       </div>
       

            <section className={style.product_details_container}>
              <h1 className={`h2 ${style.h1}`}>{productInfo.name}</h1>
              <p className={style.product_price}>Rs. {productInfo.price}</p>
              <p className={style.product_description}>
               {productInfo.description}</p>
                <div className={style.add_to_cart_btn_container}>
                  <ProductQuantityToggler  quantity={ProductQuantity} handler={productQuantityManager} />
                 
                  <button onClick={handleAddToCart} className={"button-2"}>Add to Cart</button>
                </div>
              <StarRating rating={productInfo.rating} isShowTitle={true} />

              </section>


       </section>
       
       <section className={CreateClasses(style.product_reviews_container)}>
          <h2 className="h3 mb-3 mt-3">Product Reviews</h2>
          <div className={style.product_reviews_list}>
            {
              productReviews.map(({user,rating,comment,DOC},index)=><div className={style.product_review_item} key={index}>
                <div className={style.product_review_header}>
                  <div className={style.product_review_user_info}>
                    <span className={style.user_name}>{user}</span>
                    <span className={style.date}>{formatMongoDateToWords(DOC)}</span>
                  </div>
                  <StarRating  rating={rating} isShowTitle={false} />
                </div>
                <p className={style.product_review_text}>{comment}</p>
              </div>)
}          
             {
            
            
              productReviews.length === 0 ?<><h3>No reviews found.</h3></>:null
            }
          </div>


       </section>
       {
        userState.loginStatus && 
             <section className={style.write_product_review_container}>

        <h2 className="h3 mb-3 mt-3">Write a Product Review</h2>
        <form onSubmit={(e)=>e.preventDefault()} className={style.write_product_review_form}>
         
            <textarea onChange={(e)=>setNewReveiw({...newReview,comment:e.target.value})}  placeholder='Write your review here' value={newReview.comment} />
          <div className={style.form_group}>
            <label htmlFor="review_rating">Your Rating</label>
            <StarRating  isHalf={false} onRatingChange={HandleRatingChanged} rating={newReview.rating} edit={true} isShowTitle={false} />
          </div>
          <button onClick={handleReviewSubmision} type='submit' className={"mt-2 button-2"}>Submit Review</button>
          </form>

     </section>
       }

      



      </main>

  
    </>
  )
  }

}

export default SingleProduct;