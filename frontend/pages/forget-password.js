import React, { useEffect, useState } from 'react'
import Banner from '../components/Banner/Banner';
import style from '../styles/sign-in.module.scss';
import { CreateClasses } from '../functions/methods';
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { toast } from 'react-toastify';
import {useDispatch, useSelector} from "react-redux";
import { loginUser, requestToken, resetPasswordMethod } from '../store/slices/userMethods';
import { storeUserInformation } from '../store/slices/userSlices';
import { useRouter } from 'next/router';
function forgetPassword() {

  // variables declaration & definition 
  const userState = useSelector((state)=>state.user);

  const reset_pass_credentials_template =  {username:"",token:"",password:""};
  const [toggle_fields,set_toggle_fields] = useState(false);
  const [reset_pass_credentials,set_reset_pass_credentials] = useState(reset_pass_credentials_template);
  const router = useRouter();
  const dispatch = useDispatch();

  // ===========================

 const manageNewTokenRequest = async (e)=>
  {
    e.preventDefault();
     if(!reset_pass_credentials.username)
      {
       return toast.error("Please, enter your email or username to found your account!");
      }
    const response = await requestToken({username:reset_pass_credentials.username});
    if(response !== false)
    {
      toast.success("verification code sent to your email!");
      set_toggle_fields(true);
    }
    else
    {
      toast.error("Failed to send new verification code!");
    }
  }


   const form_fields_manager=(e)=>
   {
    const {value,name} = e.target;
         
    set_reset_pass_credentials({...reset_pass_credentials,[name]:value});
   }

   const reset_pass_manager = async ()=>
   {
    if(!reset_pass_credentials.password)
    {
     return  toast.error("Please, enter your password!");
    }
    else if(!reset_pass_credentials.token)
    {
     return  toast.error("Please, enter verification token!");
    }

    let tempCopy = {...reset_pass_credentials};
    tempCopy.username =tempCopy.username.trim();
    tempCopy.password =tempCopy.password.trim();
    tempCopy.token = tempCopy.token.trim();

            
    const response = await resetPasswordMethod(tempCopy);
    if(response !== false)
    {
      toast.success("Password changed successfull!");
      router.push("/sign-in");
      set_reset_pass_credentials(reset_pass_credentials_template);
    }
   
        
   }



  useEffect((e)=>{
          
     if(userState.loginStatus === true)
     {
      router.push("/");
     }

  },[userState]);



  return (
     <>
     
     <Banner title={"Reset Password"}/>
     <main className={CreateClasses("container",style.signIn_page_container)}>
      
      <form className={style.inner_container}  onSubmit={(e)=>e.preventDefault()}>

       <h2 className="h3 upper mb-2">Forget Password?</h2>
      {
        !toggle_fields &&
        <>
       <input autoComplete='off' onChange={form_fields_manager} value={reset_pass_credentials.username} name='username' type="text" placeholder='Enter your email or username' />
        <button onClick={manageNewTokenRequest}  className="mt-2 button-2">Send Code</button>
             </>
      }
        
        {
          toggle_fields && <>
           <input autoComplete='false' value={reset_pass_credentials.token} type="text" name='token' onChange={form_fields_manager} placeholder='Enter 6 digit token' />
       <input autoComplete='false' value={reset_pass_credentials.password} type="password" name='password' onChange={form_fields_manager} placeholder='Enter new password' />
          <button onClick={reset_pass_manager}  className="mt-2 button-2">Reset Password</button>
          </>
        }
      
       

      {/* Remember me & forget password option  */}
      <div className={style.rememberMe_and_forgetpassword}>
      
        
          <Link  href="/sign-in">want to sign in?</Link>
           {
           toggle_fields && 
          <Link  href={"#"} onClick={manageNewTokenRequest} >Request a new token.</Link>
           }
        


      </div>
   

      </form>

     </main>
     
     
     </>
  )
}

export default forgetPassword;