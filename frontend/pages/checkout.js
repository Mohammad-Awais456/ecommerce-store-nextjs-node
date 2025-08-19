import React, { useEffect, useState } from 'react'
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
import { updateTotalPrice, updateWholeCart } from '../store/slices/cart';
import { getProductByID } from '../store/slices/productMethods';
import { createProductOrder } from '../store/slices/orders';
function  Checkout() {

  // variables declaration & definition 
    const dispatch = useDispatch();
    const cartState = useSelector((state)=>state.cart);
    const userState = useSelector((state)=>state.user);
    const router = useRouter();

    const orderItemTemplate = {name:"",price:"",quantity:0,image:"",product:""}
    const initialOrderForm = {
      shippingInfo:{personName:"",city:"",country:"",address:"",contactNumber:""},
      orderItems:[],
      totalPrice:0,
      paymentType:"COD"
    }
    const [orderForm,setOrderForm ]  =useState(initialOrderForm);

  // ===========================
   async function populateOrderItems() {
  
    
    if (cartState.cart.length === 0) 
      {
        dispatch(updateTotalPrice(0));
       return false;
      }
  
    let newForShowing = [];
    let total = 0;
  
    for (const item of cartState.cart) {   // ✅ safer than forEach with async
      const data = await getProductByID(item.productId);
  
      if (data !== false) {
          total+=  (data.price*item.quantity);
  
        newForShowing.push({
          product: item.productId,
          quantity: item.quantity,
          image: data.gallery.images[data.gallery.featuredImage],
          price: data.price,
          name: data.name,
        });
      }
    }
    
    dispatch(updateTotalPrice(total));

    if(newForShowing.length ===0) {toast.info("Cart is empty, no items are found!");return false;}

    const updatedFormData = {...orderForm,orderItems:newForShowing,totalPrice:total}


    setOrderForm(updatedFormData)
    console.log(updatedFormData);
    return updatedFormData;
 
      
    
  }
  // ===========================
  function validateInputForms()
  {
    let retunValue = false;
    if(!orderForm.shippingInfo.personName.trim())
    {
      toast.info("Please, enter your full name!");
    }
    else if(!orderForm.shippingInfo.contactNumber.trim())
    {
      toast.info("Please, enter your contact number!");
    }
    else if(!orderForm.shippingInfo.address.trim())
    {
      toast.info("Please, enter order delivery address!");
    }
    else if(!orderForm.shippingInfo.city.trim())
    {
      toast.info("Please, enter city name where order will be delivered!");
    }
    else if(!orderForm.shippingInfo.country.trim())
      {
        toast.info("Please, enter country name where order will be delivered!");
      }
      else if(orderForm.shippingInfo.country.toLowerCase() !== "pakistan")
        {
    toast.info("Sorry, we don't ship outside of the Pakistan.");

  }
    else
    {
      retunValue = true;
    }
    return retunValue;
  }
  const handleFormChange = (e)=>
  {
    
    const {name,value} = e.target;

    setOrderForm({...orderForm,shippingInfo:{...orderForm.shippingInfo,[name]:value}})
  }
  // ===========================
  const handleOrderCreation = async ()=>
  {
    const isFormFilled = validateInputForms();
    if(!isFormFilled){ return ;}

    const updatedFormData = await populateOrderItems() ;
    if(updatedFormData !== false)
    {
       const res = await  createProductOrder(updatedFormData);
       if(res !== false)
       {
          setOrderForm(initialOrderForm);
          dispatch(updateTotalPrice(0));
          dispatch(updateWholeCart([]));
          router.push("/shop");

       }

    }
  }

  useEffect(()=>{
     if(cartState.cart.length === 0 )
     {
         toast.info("Cart is empty, add items in the cart for checkout!");
       router.push("/shop");
     }
     if(userState.loginStatus !== true )
     {
      if(userState.user.verified !== true)
      {

        router.push("/sign-in")
      }
     }

  },[])



  return (
     <>
     
     <Banner title={"Checkout Menu"}/>
     <main className={CreateClasses("container",style.cart_page_container)}>
      
      <section className={style.billing_details_container}>

        <h2 className='h3 mb-1'>Billing Detials</h2>
        <form onSubmit={(e)=>e.preventDefault()} className={style.billing_details_form}>
          <input type="text" onChange={handleFormChange} value={orderForm.shippingInfo.personName} name='personName' placeholder='Full Name*'/>
          <input type="text" onChange={handleFormChange} value={orderForm.shippingInfo.contactNumber}  name="contactNumber" placeholder='Phone Number*'/>
          <input type="text" onChange={handleFormChange} value={orderForm.shippingInfo.address}  name="address" placeholder='Delivery address*'/>
          <input type="text" onChange={handleFormChange} value={orderForm.shippingInfo.city}  name="city" placeholder='City*'/>
          <input type="text" onChange={handleFormChange} value={orderForm.shippingInfo.country}  name="country" placeholder='Country*'/>
          <div > <span className='mid_text'>Payment Method:</span> Cash On Delivery</div>

        </form>
        


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
         <button onClick={handleOrderCreation} className={CreateClasses("button-1 mt-3",style.cart_summary_btn)}>Place Order</button>
      </section>

     </main>
     
     
     </>
  )
}

export default Checkout;