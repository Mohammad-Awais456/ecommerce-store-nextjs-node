import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss';
import {useEffect} from 'react';
import { CreateClasses, trim_text } from '../functions/methods';
import Heading2 from '../components/Headings/Heading2';
import { useDispatch,useSelector} from 'react-redux';
import ParticleBackground from '../components/particleBG/ParticleBackground';
import { getAllProducts } from '../store/slices/productMethods';
import { useState } from 'react';
import Product from '../components/Product/Product';

// import { fetchAllProducts } from '../store/slices/productMethods';

export default function Home() {

  const settings = useSelector((state)=>state.settings);
   const dispatch = useDispatch();
      const [featuredProducts,setFeaturedProducts]=useState([]);

function filterByKeyValue(arr, key, value) {
  return arr.filter(obj => obj[key] === value);
}
   const showProducts = async ()=>
   {
       const res= await getAllProducts();
       console.log((res),"featured products here");
       
       if(res !== false)
       {
         const getFilteredData = filterByKeyValue(res,"featuredProduct",true);
         console.log(getFilteredData,"filtered");
         
         setFeaturedProducts(getFilteredData);
       }

   }
   useEffect(() => {
      
      // dispatch(fetchAllProducts());
      //  console.log(products,'from index ap');
      showProducts();
         
   }, [])
   


  return (
   <>

      <main id={styles.hero_section_container} className={CreateClasses("container_fluid")}>

            <ParticleBackground />
         <section  className={CreateClasses(styles.hero_section_inner_container,"container")}>
            <div className={CreateClasses(styles["hero_section_content"])}>

             <h1 className={CreateClasses(styles.heroSection_main_heading,"h1")}>Welcome to {settings.data.siteTitle}</h1>
             <p className="text">{settings.data.siteDescription}</p>
             <a href="/shop" className="button-2">Shop Now</a>


            </div>

          




         </section>    
      
      </main>
   
     {/* categories section  */}

     {
      featuredProducts.length !== 0 ?
      <section className={CreateClasses(styles.home_page_categories_container,"mb-3 container")}>

     <Heading2  title1="Products" title2={"Featured"} />
        
       <div className={CreateClasses("container mt-2 mb-3 ",styles.products_container)}>
      

       {
          featuredProducts.map(({rating,gallery,_id,name,price})=><Product rating={rating} imgUrl={gallery.images[gallery.featuredImage]} key={_id}  title={trim_text(name,25)} productID={_id} price={price} /> )
         }  
      
         </div>

     </section>
     :""
   }


   </>
  )
}
