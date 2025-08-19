import React, { useEffect, useState } from 'react'
import Banner from '../components/Banner/Banner';
import style from '../styles/sign-in.module.scss';
import { CreateClasses } from '../functions/methods';
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { toast } from 'react-toastify';
import {useDispatch, useSelector} from "react-redux";
import { loginUser } from '../store/slices/userMethods';
import { storeUserInformation } from '../store/slices/userSlices';
import { useRouter } from 'next/router';
function SignIn() {

  // variables declaration & definition 
  const userState = useSelector((state)=>state.user);

  const signIn_credentials_template =  {username:"",password:""};
  const [signIn_credentials,set_signIn_credentials] = useState(signIn_credentials_template);
  const router = useRouter();
  const dispatch = useDispatch();

  // ===========================


   const form_fields_manager=(e)=>
   {
    const {value,name} = e.target;
         
    set_signIn_credentials({...signIn_credentials,[name]:value});
   }

   const login_manager = async ()=>
   {
    if(!signIn_credentials.username)
      {
       return toast.error("Please, enter your username!");
      }
    else if(!signIn_credentials.password)
    {
     return  toast.error("Please, enter your password!");
    }

    let tempCopy = {...signIn_credentials};
    tempCopy.password =tempCopy.password.trim();
    tempCopy.username = tempCopy.username.trim();

            
    const response = await loginUser(tempCopy);
    if(response !== false)
    {
      console.log(response,"store user info");
      
      dispatch(storeUserInformation(response));
      toast.success("Sign in successfull!");
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
     
     <Banner title={"Sign In"}/>
     <main className={CreateClasses("container",style.signIn_page_container)}>
      
      <form className={style.inner_container}  onSubmit={(e)=>e.preventDefault()}>
       <h2 className="h3 upper mb-2">Welcome to JacketMasters</h2>
       <input autoComplete='off' onChange={form_fields_manager} value={signIn_credentials.username} name='username' type="text" placeholder='Enter your email or username' />
       <input autoComplete='false' value={signIn_credentials.password} type="password" name='password' onChange={form_fields_manager} placeholder='Enter your password' />
       <button onClick={login_manager}  className="mt-2 button-2">Submit</button>

      {/* Remember me & forget password option  */}
      <div className={style.rememberMe_and_forgetpassword}>
        {/* <div>

      <input className='text' type="checkbox" id={"remember me"} name="rememberMe" value={"remember me"} />
      <label className='text'  htmlFor={"remember me"}>Remember me?</label>
        </div> */}
        
          <Link  href="/forget-password">Forget password?</Link>
        


      </div>
      {/* ====================  */}
      <div className={style.or_line}>
        <span></span>
        <p className='h3'>OR</p>
      </div>
      <p className={CreateClasses("text",style.createAccount)}>
        New member? <Link href="/sign-up">Create Account</Link>
      </p>
      
      
      </form>

     </main>
     
     
     </>
  )
}

export default SignIn;