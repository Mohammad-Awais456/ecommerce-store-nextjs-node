import React, { useEffect } from 'react'
import { useDispatch,useSelector } from 'react-redux';
import { is_login } from '../../functions/methods';
import { storeUserInformation } from '../../store/slices/userSlices';
import { useRouter } from 'next/router';
import { fetchSettingsAndUpdate} from '../../store/slices/globalSettings';

function Starter() {

    const dispatch = useDispatch();
  const userState = useSelector((state)=>state.user);
  const router = useRouter();



    async function appLauncher()
    {
      const response = await is_login();
           dispatch(fetchSettingsAndUpdate());
      
     


      if(response.success === true)
      {

      
        
        dispatch(storeUserInformation({
          loginStatus:true,
          user:response.data
        }));
      
            
      }else 
      {
         dispatch(storeUserInformation({
          loginStatus:false,
          user:""
        }));
      }
    
      
    
    }
    
    
    useEffect(()=>{
      appLauncher();
    },[]);

    useEffect(()=>{
       
       if(userState?.user?.verified !== true && userState?.loginStatus === true)
          {
            router.push("/verify") 
          } 
    });
    

  return (
<>
</>
  )
}

export default Starter