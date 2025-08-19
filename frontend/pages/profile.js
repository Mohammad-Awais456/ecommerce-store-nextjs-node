import  { useEffect, useState } from 'react'
import Banner from '../components/Banner/Banner';
import style from '../styles/sign-in.module.scss';
import { CreateClasses } from '../functions/methods';
import { toast } from 'react-toastify';
import { updateProfileData } from '../store/slices/userMethods';
import { storeUserInformation } from '../store/slices/userSlices';
import {useDispatch, useSelector} from "react-redux";
import { useRouter } from 'next/router';


function profilePage() {

  // variables declaration & definition 
  const userState = useSelector((state)=>state.user);

  const profile_data_template =  {name:"",username:"",email:"",orders:[]};
  const [profile_data,set_profile_data] = useState(profile_data_template);
  const [is_form_edited,set_is_form_edited] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  // ===========================


   const form_fields_manager=(e)=>
   {
    const {value,name} = e.target;
         
    set_profile_data({...profile_data,[name]:value});
    set_is_form_edited(true);
   }

   const profile_manager = async ()=>
   {
    if(!profile_data.name)
      {
       return toast.error("Please, enter your name!");
      }
 

    let tempCopy = {name:profile_data.name.trim()};
    

            
    const response = await updateProfileData(tempCopy);
    if(response !== false)
    {
      dispatch(storeUserInformation(response));
      toast.success("Profile updated successfully!");
      set_is_form_edited(false);
      
    }
    else
    {
      toast.error(response.msg);

    }
        
   }



  useEffect((e)=>{
          
    
    
    console.log("userState",userState);
    if(userState.loginStatus !== true)
      {
      router.push("/");
     }
     else 
     {
      // if user is logged in then set the profile data
      set_profile_data({
        name:userState.user.name,
        username:userState.user.username,
        email:userState.user.email,
      });
     }


     



  },[userState]);


  useEffect(() => {
  const handleBeforeUnload = (event) => {
    if(!is_form_edited) return; // If the form is not edited, no need to show the dialog
      event.preventDefault();
      event.returnValue = ""; // Required for Chrome to show the confirmation dialog
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [is_form_edited])
  

  return (
     <>
     
     <Banner title={"Profile"}/>
     <main className={CreateClasses("container",style.signIn_page_container)}>
      
      <form className={CreateClasses(style.inner_container,style.profile_form)}  onSubmit={(e)=>e.preventDefault()}>
       <h2 className="h3 upper mb-2">Profile Detials</h2>
       <span>Name:</span>
       <input   autoComplete='off' onChange={form_fields_manager} value={profile_data.name} name='name' type="text" placeholder='Your Name' />

       <span>Email:</span>
       <input   disabled={true}  value={profile_data.email}  type="text" placeholder='Your Email' />
       <span>Username:</span>
       <input   disabled={true}  value={profile_data.username}  type="text" placeholder='Your username' />


{
  is_form_edited &&
       <button onClick={profile_manager}   className="mt-2 button-2">Save Changes</button>
}

    
        


   
      
      </form>

     </main>
     
     
     </>
  )
}

export default profilePage;