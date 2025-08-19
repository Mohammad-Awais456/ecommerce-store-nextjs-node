import React, { useEffect, useRef, useState } from 'react'
import Banner from '../../components/Banner/Banner'
import style from "../../styles/adminPages.module.scss";
import { CreateClasses } from '../../functions/methods';
import { useDispatch, useSelector } from 'react-redux';
import { BackEndServerImagePath } from '../../store/API/API_URL';
import { toast } from 'react-toastify';
import { updateLogoandOtherSetthings } from '../../store/slices/globalSettingMethods';
import { fetchSettingsAndUpdate } from '../../store/slices/globalSettings';






function settings() {

  const logoFile_referece = useRef();
  const dispatch = useDispatch();
  const settingsState =   useSelector((state)=>state.settings);
  const [is_form_edited, set_is_form_edited] = useState(false);
   const [settings,setSettings]=useState({
    logo: "",
    siteTitle: "My App",
    siteDescription: "This ",
})


  function handleInputChange(e)
  {
    set_is_form_edited(true);

    const {value,name}=e.target;
    setSettings({...settings,[name]:value});
  }
    
  const updateSettings = async (e)=>
  {

     if (settings.logo === "") {
          return toast.warn("Please Select Logo!");
        }
     if (!settings.siteTitle?.trim() ) 
        {
            return toast.warn("Please, enter site title!");
        }
      if (!settings.siteDescription?.trim() ) 
      {
        return toast.warn("Please, enter site description!");

      }
      const UpdatedForm = new FormData();
      // if( typeof settings.logo  ==="string")
        // {
          
          UpdatedForm.append("logo",settings.logo);
          UpdatedForm.append("siteTitle",settings.siteTitle);
          UpdatedForm.append("siteDescription",settings.siteDescription);

          const res = await updateLogoandOtherSetthings(UpdatedForm);
          if(res !== false)
          {
                     
                     dispatch(fetchSettingsAndUpdate());
                     set_is_form_edited(false);
          }
          
        // }



  }
  const handleFileChange = (e)=>
  {
    set_is_form_edited(true);
    const SelectedFile = e.target.files[0];
    
    setSettings({...settings,logo:SelectedFile})


  }

useEffect(()=>{


   
       setSettings(settingsState.data)




},[])
useEffect(()=>{
  
        const handleBeforeUnload = (event) => {
      if (!is_form_edited) return; // If the form is not edited, no need to show the dialog
      event.preventDefault();
      event.returnValue = ""; // Required for Chrome to show the confirmation dialog
    };
        window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
},[is_form_edited]);


  return (
    <>
       <Banner  title='Manage Settings'/>
      <main className={CreateClasses("container", style.admin_page_container)}>
          <br />
                       
                       {
                        (typeof settings.logo === 'string' && settings.logo.trim()) || settings.logo instanceof File ?
              
                     <img     

                        style={{
                          "max-width":"30rem",
                          "max-height":"30rem",
                          "objectFit":"contain"

                        }}
                           src={typeof settings.logo === "string" ? BackEndServerImagePath + settings.logo : URL.createObjectURL(settings.logo)}
                           className='mb-2' alt="product image" />
                          :<>
                          <h3 >No logo found, please select logo.</h3>
                          </>
                          }

                      
                      

          <br />
          <br />

                    <input id='logoInputFile'  ref={logoFile_referece}  onChange={handleFileChange} type="file" name="images" accept="image/*"  style={{ "display": "none" }} className=" mb-2 mt-2" />
          
      <label htmlFor="logoInputFile" className="mt-3 button-1">Select Logo</label>
          <br />
          <br />
          <br />
          <label >Site Title:</label>
          <br />
          <br />

        <input value={settings.siteTitle} onChange={handleInputChange}  type="text" name='siteTitle' className="common_input" placeholder='Site Title' />
          <br />
          <br />
          <label >Site Description:</label>
          <br />
          <br />

        <textarea  value={settings.siteDescription} onChange={handleInputChange}  style={{ "minHeight": "10rem", "maxHeight": "15rem", "maxWidth": "100%" }} name="siteDescription" type="text" className="common_input" placeholder='Enter Site Description' />

      {
        is_form_edited &&
      <button onClick={updateSettings} className="mt-3 button-1">Save Changes</button>
      }
      </main>

    </>
  )
}

export default settings