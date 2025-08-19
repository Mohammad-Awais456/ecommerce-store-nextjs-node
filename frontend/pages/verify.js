import React, { useEffect, useState } from 'react'
import Banner from '../components/Banner/Banner';
import style from '../styles/sign-in.module.scss';
import { CreateClasses } from '../functions/methods';
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { toast } from 'react-toastify';
import {useDispatch, useSelector} from "react-redux";
import { verifyAccount,requestToken } from '../store/slices/userMethods';
import { storeUserInformation } from '../store/slices/userSlices';
import { useRouter } from 'next/router';
function SignIn() {

  // variables declaration & definition 
  const userState = useSelector((state)=>state.user);

  const verification_credentials_template =  {token:""};
  const [verification_credentials,set_verification_credentials] = useState(verification_credentials_template);
  const router = useRouter();
  const dispatch = useDispatch();

  // ===========================


  const manageNewTokenRequest = async (e)=>
  {
    e.preventDefault();
    const response = await requestToken({username:userState.user.username});
    if(response !== false)
    {
      toast.success("New verification code sent to your email!");
    }
    else
    {
      toast.error("Failed to send new verification code!");
    }
  }


   const form_fields_manager=(e)=>
   {
    const {value,name} = e.target;
         
    set_verification_credentials({...verification_credentials,[name]:value});
   }

   const verification_manager = async ()=>
   {
    if(!verification_credentials.token)
      {
       return toast.error("Please, enter verification code!");
      }
    

    let tempCopy = {...verification_credentials};
    tempCopy.token =tempCopy.token.trim();

            
    const response = await verifyAccount(tempCopy);
    if(response !== false)
    {
     toast.success("Verified Successfully!");
     window.location.reload();
    }
    else
    {
      toast.error(response.msg);

    }
        
   }



  useEffect((e)=>{
    console.log("verify page, user info",userState);
    
          
     if(userState.loginStatus === false || userState.user.verified === true)
     {
      router.push("/");
     }

  },[userState]);



  return (
     <>
     
     <Banner title={"Verify Account"}/>
     <main className={CreateClasses("container",style.signIn_page_container)}>
      
      <form className={style.inner_container}  onSubmit={(e)=>e.preventDefault()}>
       <h2 className="h3 upper mb-2">Verify Your Account</h2>
       <input autoComplete='off' onChange={form_fields_manager} value={verification_credentials.token} name='token' type="text" placeholder='Enter verification code sent on your email.' />
      
       <button onClick={verification_manager}  className="mt-2 button-2">Verify</button>

   
      {/* ====================  */}
      <div className={style.or_line}>
        <span></span>
        <p className='h3'>OR</p>
      </div>
     
      
      <Link href={"#"} onClick={manageNewTokenRequest} className={CreateClasses("button-2",style.signinWithGoogle)}>
       Request New Code
      </Link>

      </form>

     </main>
     
     
     </>
  )
}

export default SignIn;