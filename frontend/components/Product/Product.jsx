import React from 'react';
import Image from 'next/image';
import { StarRating } from '../common/StarRating';
import Link from 'next/link';
import { BackEndServerImagePath } from '../../store/API/API_URL';


function Product({title,price,imgUrl,productID,rating}) {






  return (
    <Link  href={`/shop/${productID}`}  className="single_product_1">

<figure  className="product_img_container">
     <img style={{"objectFit":"cover"}}  src={BackEndServerImagePath+imgUrl} className='responsive' alt={title}  />
     </figure>

   <h3 itemProp="name" className='mt-1 mid_text'>{title}</h3>
     <StarRating rating={rating}  />

  <p className="mid_text" >

   <data itemProp='price' value={price}>Rs. {price}</data>
   <meta itemProp="priceCurrency" content="RS" />
  </p>


   </Link>
  )
}

Product.defaultProps ={
rating:3.5,
price:29.99,
title:"This is just test product, what do you think brother?",
imgUrl:"#",
productID:"12323"
}

export default Product