import Image from 'next/image';
import {useEffect, useState} from "react";
import { FaBars,FaShoppingCart  } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { logout_User } from '../../store/slices/userMethods';
import { storeUserInformation } from '../../store/slices/userSlices';
import { toast } from 'react-toastify';
import { BackEndServerImagePath } from '../../store/API/API_URL';


function Header() {

       const setthings = useSelector((state)=>state.settings);
  
  const menu_links =[
    {
      link:"/",
      title:"home"
    },
    {
      link:"/shop",
      title:"Shop"
    },
 
    {
      link:"/contact",
      title:"Contact"
    }
 
  ]
  const [getMenuLinks, setMenuLinks] = useState(menu_links);
  const dispatch = useDispatch();
  const userState = useSelector((state)=>state.user);
  const [showNavMenu, setNavMenuState] = useState(false);
  
useEffect(() => {

  if(userState.loginStatus)
  {
    if(userState.user.role === "admin")
    {
     setMenuLinks([
        ...menu_links,
        {
          link:"/admin",
          title:"Admin Dashboard"
        }
      ])
    }
    else 
    {

      setMenuLinks([
        ...menu_links,
        {
          link:"/profile",
          title:"Profile"
        }
      ])

    }
  }
  else 
  {
    setMenuLinks(menu_links);
  }

}, [userState])



const logoutManager = async (e)=>
{
  
  e.preventDefault();
  const res = await logout_User();

  
  if(res !== false)
  {

    toast.success("Logout successfull!");
    dispatch(storeUserInformation({
      user:res.user,
      loginStatus:res.loginStatus
    }))
  }
  


}





  return (





    <>
    <header id="main_header" className={showNavMenu?"active container_fluid":"container_fluid"}>
     <div className="container innerHeaderContainer">

     <a href="/" className="logo_container">
 
     {
       setthings.data.logo !== "" ?
       <img src={BackEndServerImagePath+setthings.data.logo} alt="" />
       :
       <>
         {setthings.data.siteTitle}
      </>
    }
     </a>
     
      <nav className="nav_menu_wrapper">
          
       <ul className="menu_items_container">
        {
          getMenuLinks.map((e)=> <li key={e.link} className="  menu_items"><Link className=" mid_text " href={e.link}>{e.title}</Link></li>)
        }

       { 

       userState.loginStatus
       ?

       <li className="menu_items"><Link className=" mid_text " onClick={logoutManager}  href={"/log-out"}>Logout</Link></li>
       :
      <>

        <li className="menu_items"><Link className=" mid_text " href={"/sign-in"}>Sign In</Link></li>
        <li className="menu_items"><Link className=" mid_text " href={"/sign-up"}>Sign Up</Link></li>
      </>
  

        }

       </ul>


      </nav>
     <div className="header_profile_menu_container">

      <Link href={"/cart"} className="header_cart_container">
       <span className='header_cart_numberings'>99+</span>
      <FaShoppingCart />
      </Link>

     </div>
      <button onClick={()=>setNavMenuState(!showNavMenu)} id="toggle_menu_button_container">
       {
        showNavMenu?
        <AiOutlineClose />
        :
      <FaBars />
       } 

      </button>



     </div>
    </header>
    
    
    </>
  )
}

export default Header