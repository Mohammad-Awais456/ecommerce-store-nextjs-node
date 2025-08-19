import React from 'react'
import Link from "next/link";
import { FaFacebookSquare  } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { useSelector } from 'react-redux';


function Footer() {


     const setthings = useSelector((state)=>state.settings);


  return (
   
    <footer className='Main_Footer container_fluid'>
       <section className="container innerFooter_container">

       <h2 className="h2 footerheading upper">{setthings.data.siteTitle}</h2>
       <nav className='footerNavigation'>
        <ul>
            <li><Link href={"/"}>Home</Link></li>
            <li><Link href={"/shop"}>Shop</Link></li>
            <li><Link href={"/contact"}>contact</Link></li>
            <li><Link href={"/sign-in"}>Sign In</Link></li>
            <li><Link href={"/sign-up"}>Register</Link></li>
        </ul>
       </nav>
       {/* <div className="socilaLinks_container">

           <a href="#" className="icon"><FaFacebookSquare  /></a>
           <a href="#" className="icon"><FaLinkedin /></a>
           <a href="#" className="icon"><FaInstagramSquare /></a>

       </div> */}
        
       <p className='copyRight mid_text' lang="en" title="Copyright Notice" aria-label="Copyright information">
        <small>&copy; 2025 {setthings.data.siteTitle}. All rights reserved.</small>
      </p>

       </section>
    </footer>


  )
}

export default Footer