import React, { useEffect } from 'react'
import { PiGreaterThan } from "react-icons/pi";
import { CreateClasses } from '../../functions/methods';
import style from "../../styles/shop.module.scss";

import { useRouter } from "next/router";
import Link from 'next/link';


function Banner({title = "Nothing Here",heading1=true,customBreadCrumb=null}) {
 const router = useRouter();

// remove query params & split path
  const segments = router.asPath.split("?")[0].split("/").filter(Boolean);
const [breadcrumbs, Setbreadcrumbs] = React.useState([
    { label: "Home", href: "/" }
  ]);

 

useEffect(() => {

  // console.log(segments, "Segments from router");
  let segmentsCreation=[ { label: "Home", href: "/" }];
 segments.forEach((seg, idx) => {
  if(seg === "product")
  {
    return;
  }
    const href = "/" + segments.slice(0, idx + 1).join("/");

    // Special case handling
    let label = seg.charAt(0).toUpperCase() + seg.slice(1); // default capitalized

    if (seg === "new" && segments[idx - 1] === "product") {
      label = "Add New Product";
    }
    if (seg === "edit" && segments[idx - 1] === "product") {
      label = "Edit Product";
    }
segmentsCreation.push({ label, href });
});
// console.log(segmentsCreation, "Breadcrumbs temp array");
if(customBreadCrumb!==null)
{
  segmentsCreation.at(-1).label=customBreadCrumb;
}
Setbreadcrumbs([...segmentsCreation]);
}, [router.asPath,customBreadCrumb]);


  return (
   <>
   
   <section className={CreateClasses("container",style.shopPage_banner)}>
    {
      heading1 && <h1 className="h1 upper">
    {title}
   </h1>
    }
   

{/* breadcrumb  */}
   <nav aria-label="Breadcrumb" className={CreateClasses(style.breadcrum_container)}>
    <ul>
      {
        breadcrumbs.map((breadcrumb, index) => (
          <li key={index}>
            <Link className="text upper" href={breadcrumb.href}>{breadcrumb.label}</Link>
            {index < breadcrumbs.length - 1 && <PiGreaterThan />}
          </li>
        ))
      }
      {/* <li><a className="text upper" href="/">Home</a></li>

       <li className={style.icon}><PiGreaterThan /></li>

      <li><a className="text upper"   href="/about">About</a></li> 

       <li className={style.icon}><PiGreaterThan /></li>

      <li><a className="text upper" href="/contact">Contact</a></li> */}
    </ul>
  </nav>

   </section>
   
   
   
   
   
   </>
  )
}




export default Banner