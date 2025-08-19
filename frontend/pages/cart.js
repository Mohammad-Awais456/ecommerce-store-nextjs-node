import React, { useEffect, useRef, useState } from 'react'
import Banner from '../components/Banner/Banner';
import style from '../styles/cart.module.scss';
import { CreateClasses } from '../functions/methods';
import { CiCircleRemove } from "react-icons/ci";
import Link from "next/link";
import { toast } from 'react-toastify';
import {useDispatch, useSelector} from "react-redux";
import { storeUserInformation } from '../store/slices/userSlices';
import { useRouter } from 'next/router';
import ProductQuantityToggler from '../components/common/ProductQuantityToggler/ProductQuantityToggler';
import { getProductByID } from '../store/slices/productMethods';
import { deleteProductFromCart, updateProductQuantity, updateTotalPrice, updateWholeCart } from '../store/slices/cart';
import { BackEndServerImagePath } from '../store/API/API_URL';

function  Cart() {
  
  // variables declaration & definition 
  const firstLoad = useRef(true); // 🔑 flag to track first load
       const dispatch = useDispatch();
       const cartState = useSelector((state)=>state.cart);
       const userState = useSelector((state)=>state.user);
       const [cartData,setCartData] = useState([]);
  // ===========================




 async function populateCartData() {

  
  if (cartState.cart.length === 0) 
    {
      dispatch(updateTotalPrice(0));

      return setCartData([]);
    }

  let newCart = [];
  let newForShowing = [];
  let total = 0;

  for (const item of cartState.cart) {   // ✅ safer than forEach with async
    const data = await getProductByID(item.productId);

    if (data !== false) {
      // clone item so we don't push frozen object
      newCart.push({ ...item });  

      newForShowing.push({
        productId: item.productId,
        quantity: item.quantity,
        preview: data.gallery.images[data.gallery.featuredImage],
        price: data.price,
        name: data.name,
      });
    }
  }
 newForShowing.forEach(({price,quantity})=>{
        total+=  (price*quantity);
      })

      dispatch(updateTotalPrice(total));
  setCartData(newForShowing);
   if (firstLoad.current) {
      dispatch(updateWholeCart(newCart)); // only run 1st time
      firstLoad.current = false; // ✅ stop future calls
    }
}


useEffect(()=>{

  populateCartData()


},[cartState.cart])

  



  return (
     <>
     
     <Banner title={"Cart Menu"}/>
     <main className={CreateClasses("container",style.cart_page_container)}>
      
      <section className={style.cart_items_list_container}>

         { cartData.length !==0 ?
          cartData.map((item,index)=>  
          <div className={style.cart_product}>
            <figure className={style.cart_product_preview}>
              <img src={BackEndServerImagePath+item.preview} alt="product image" />
            </figure>
            <div className={style.cart_product_details}>
              <h3 className={style.cart_product_title}>{item.name}</h3>
              <p style={{"color":"black"}} className={style.cart_product_price}>Rs. {item.price}</p>
              <ProductQuantityToggler handler={(type)=>{

                dispatch(updateProductQuantity({productId:item.productId,type}))

              }}  quantity={item.quantity} />
              </div>

              <span  onClick={()=>{
                   if(userState.loginStatus !== true)
                   {
                      return toast.warning("Please, sign in first!");
                   }
                   if(confirm("Are you confirm to remove this product from cart?"))
                   {
                     
                     dispatch(deleteProductFromCart(item.productId));
                     dispatch(updateTotalPrice(0));
                     
                    }

              }}  className={style.cart_item_dlt_btn}><CiCircleRemove /></span>
          </div>
          ):
          <>
          <h3>Cart is empty.</h3>
          </>
          

         } 
        


      </section>
      <section className={style.cart_summary_container}>
         <h2 className='h3 mb-1'>Order Summary</h2>
         <div>
          <h3  className='mid_text'>Subtotal</h3><h3 className='mid_text'>Rs. {cartState.total}</h3>
         </div>
         <div>

          <h3 className='mid_text'>Shipping</h3><h3 className='mid_text'>Free</h3>
         </div>
         <div>

          <h3 className='mid_text'>Total</h3><h3 className='mid_text'>Rs. {cartState.total}</h3>
         </div>
         <Link href={"/checkout"} className={CreateClasses("button-1 mt-3",style.cart_summary_btn)}>Proceed to Checkout</Link>
      </section>

     </main>
     
     
     </>
  )
}

export default Cart;