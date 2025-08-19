import React, {  useEffect, useState } from 'react'
import Banner from '../components/Banner/Banner';
import style from '../styles/sign-in.module.scss';
import { CreateClasses } from '../functions/methods';
import Link from "next/link";
import { toast } from 'react-toastify';
import { storeUserInformation } from '../store/slices/userSlices';

import { FaGoogle } from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import { useRouter } from 'next/router';
import { registerUser, requestToken } from '../store/slices/userMethods';


function SignUp() {

  const userState = useSelector((state)=>state.user);
  const signUp_credentials_template =  {name:"",email:"",username:"",password:""};
  const [signUp_credentials,set_signUp_credentials] = useState(signUp_credentials_template);
  const router = useRouter();
  const dispatch = useDispatch();


const handleInputFiledsValueChange = (e)=>
{
  const {value,name} = e.target;
  set_signUp_credentials({...signUp_credentials,[name]:value});
}

  const signUp_manager = async ()=>
   {
      if(!signUp_credentials.username)
      {
         return toast.error("Please, enter your username!");
        }
        else if(!signUp_credentials.name)
      {
            
            return toast.error("Please, enter your name!");
      }
      else if(!signUp_credentials.password)
        {
          return  toast.error("Please, enter your password!");
        }
        else if(!signUp_credentials.email)
        {
            return  toast.error("Please, enter your email!");

        }

    let tempCopy = {...signUp_credentials};
    tempCopy.password =tempCopy.password.trim();
    tempCopy.username = tempCopy.username.trim();
    tempCopy.email = tempCopy.email.trim();
    tempCopy.name = tempCopy.name.trim();

            
    const response = await registerUser(tempCopy);
    if(response !== false)
    {
      toast.success("Sign Up Successfull! Please, verify your account via verification code sent to your email.");
      await requestToken({username:response.user.username});
      dispatch(storeUserInformation(response)); 
    }
    else
    {
      toast.error(response.msg);

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
     
     <Banner title={"Sign Up"}/>
     <main className={CreateClasses("container",style.signIn_page_container)}>
      
      <form className={style.inner_container}  onSubmit={(e)=>e.preventDefault()}>
       <h2 className="h3 upper mb-2">Welcome to JacketMasters</h2>

       <input name='name' onChange={handleInputFiledsValueChange} value={signUp_credentials.name} autoComplete='off' type="text" placeholder='Enter your full Name' />

       <input name='username' onChange={handleInputFiledsValueChange} value={signUp_credentials.username} autoComplete='off' type="text" placeholder='Select your username' />

       <input name='email' onChange={handleInputFiledsValueChange} value={signUp_credentials.email} autoComplete='off' type="email" placeholder='Enter your email' />

       <input name='password' onChange={handleInputFiledsValueChange} value={signUp_credentials.password} autoComplete='false' type="password" placeholder='Enter your password' />
       <button onClick={signUp_manager}  className="mt-2 button-2">Create Account</button>

     
      {/* ====================  */}
      <div className={style.or_line}>
        <span></span>
        <p className='h3'>OR</p>
      </div>
      <p className={CreateClasses("text",style.createAccount)}>
        Already have a account? <Link href="/sign-in">Sign In</Link>
      </p>
      
      

      </form>

     </main>
     
     
     </>
  )
}

export default SignUp;