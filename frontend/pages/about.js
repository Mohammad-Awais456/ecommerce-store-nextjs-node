import React, { useEffect, useState } from 'react'
import Banner from '../components/Banner/Banner';
import style from '../styles/about.module.scss';
import { CreateClasses } from '../functions/methods';
import Link from "next/link";
import { toast } from 'react-toastify';
import {useDispatch, useSelector} from "react-redux";
import { storeUserInformation } from '../store/slices/userSlices';
import { useRouter } from 'next/router';
function AboutUs() {

  // variables declaration & definition 
 

  // ===========================


  



  return (
     <>
     
     <Banner title={"About Us"}/>
     <main className={CreateClasses("container",style.about_page_container)}>
      
     

     </main>
     
     
     </>
  )
}

export default AboutUs;