import React from 'react'
import Banner from '../components/Banner/Banner';
import style from '../styles/sign-in.module.scss';
import { CreateClasses, Fetch_Data } from '../functions/methods';
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { useState } from 'react';
import { toast } from 'react-toastify';
import { contactAPIPath } from '../store/API/API_URL';

function Contact() {

const initialFormData = {
  name:"",
  email:"",
  message:""
}
const [contactForm,setContactForm] =useState(initialFormData)

const handleChange = (e)=>
{
  const {name,value} = e.target;
  setContactForm({...contactForm,[name]:value});
}

const submitMessage = async ()=>
{
  if(!contactForm.name?.trim())
  {
    return toast.warn("Please, enter your name.") 
  }
  else if(!contactForm.email?.trim())
  {
    return toast.warn("Please, enter your email.") 
  }
  else if(!contactForm.message?.trim())
  {
    return toast.warn("Please, enter your message.") 
  }

   
  const res = await Fetch_Data(contactAPIPath,"POST",true,contactForm);
  console.log(res);
  
  if(res.success !== false)
    {
      setContactForm(initialFormData);
    return toast.success(res.msg);
  }
  return toast.warn("Something wrong!");



}






  return (
     <>
     
     <Banner title={"Contact Us"}/>
     <main className={CreateClasses("container",style.signIn_page_container)}>
      
      <form  className={style.inner_container}  onSubmit={(e)=>e.preventDefault()}>
       <h2 className="h3 upper mb-2">Welcome to JacketMasters</h2>
       <input value={contactForm.name} name='name' autoComplete='off' onChange={handleChange} type="text" placeholder='Enter your full Name' />
        <input value={contactForm.email} onChange={handleChange} autoComplete='off' name='email'  type="email" placeholder='Enter your email' />
        <textarea value={contactForm.message} onChange={handleChange} name="message" placeholder='Enter your message'  />

       <button  onClick={submitMessage} className="mt-2 button-2">Submit Message</button>

     
      

      </form>

     </main>
     
     
     </>
  )
}

export default Contact;