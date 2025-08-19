import { useDispatch,useSelector} from 'react-redux';
import { fetchAllProducts, getAllProducts } from '../../store/slices/productMethods';
import { CreateClasses, Fetch_Data, getRandomID, trim_text } from '../../functions/methods';
import style from "../../styles/shop.module.scss";
import { productAPI } from '../../store/API/API_URL';
import { IoMdCloseCircle } from "react-icons/io";
import {useEffect, useState} from 'react';
import { ImFilter } from "react-icons/im";
import Product from '../../components/Product/Product';
import Banner from '../../components/Banner/Banner';


function shop() {

  const [showFilterOptions,setFilterOptions]=useState(false);
  const dispatch = useDispatch();
  const [priceMin, setPriceMin] = useState("");
const [priceMax, setPriceMax] = useState("");
  const settingsState = useSelector((state)=>state.settings);
  const [productSearchQuery,setProductSearchQuery] = useState("")
  const [allProductsData,setAllProductsData] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);


 const displayProducts = async () => {
  const params = {};

  // Add keyword
  if (productSearchQuery.trim() !== "") {
    params.keyword = productSearchQuery;
  }

  // Add categories
  if (selectedCategories.length > 0) {
    params.categories = selectedCategories.join(",");
  }

  // Add price range
  if (priceMin) params["price[gte]"] = priceMin;
  if (priceMax) params["price[lte]"] = priceMax;

  // Page & limit
  params.page = currentPage;
  params.limit = 10;


   
  const res = await getAllProducts(params);
  if (res !== false) {
    setAllProductsData(res);
  }
};

// ============================================
const toggleCategory = (cat) => {
  setSelectedCategories((prev) =>
    prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
  );
};
 

// ============================================
const handleQueryChange = (type, data) => {
  if (type === "search") {
    setProductSearchQuery(data);
  }
};

// ============================================

 
  // ====================== Code for 1st render only ===============

 useEffect(() => {
  displayProducts();
}, [productSearchQuery, selectedCategories, priceMin, priceMax, currentPage]);

  



  return (
   <>
   {/* page banner section  */}
   <Banner title={"Shop"}/>
 
{/*          ================= product filter options ================  */}

 <section className={CreateClasses(style.product_filter_container,"container")}>
 
 {/* search bar  */}
 <div className={style.search_container}>

  <input onChange={(e)=>handleQueryChange("search",e.target.value)} type="search" placeholder='Search'/>
 </div>



 {/* filter icon  */}
<div className={style.filter_icon}  onClick={()=>setFilterOptions(true)}>
  <span className="text">Filter</span>
<ImFilter />
</div>

{/* sorting options  */}
{/* <div>
    <label className='text mr-1' for="sort-options">Sort by :</label>
    <select className='dropDown-1' id="sort-options" onchange="sortProducts()">
        <option value="default">Default</option>
        <option value="low-to-high">Price: Low to High</option>
        <option value="high-to-low">Price: High to Low</option>
    </select>
</div> */}
<div className='ml-auto'>
  <p className="text">{allProductsData.length} {allProductsData.length == 1 ? "product found.":"products found."}</p>
</div>

{/* main container with all option to filer  */}
<section className={showFilterOptions?CreateClasses(style.active,style.main_filter_section_with_all_options):style.main_filter_section_with_all_options}>





 {/* inner section  */}
<div className={CreateClasses(style.inner_section)}>

<div className={style.close_icon} onClick={()=>setFilterOptions(false)}>
<IoMdCloseCircle />
</div>
{/* filter by price  */}
<div className={style.filterByPriceContainer}>
  <h3 className="h3">Filter By Price:</h3>

  <div className={style.inner_container}>
    <input type="text" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder='Min'/>

    <span>-</span>
<input type="text" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder='Max'/>
    
  </div>
</div>

{/* filter by category */}
<div className={style.filter_by_category_container}>
  <h3 className={CreateClasses(style.heading,'h3')}>Filter by Category</h3>
  <div style={ {   "width": "100%","maxHeight": "30rem"}} className='overflow_y_auto'>

 {
   settingsState.data.productCategories.map((e,index)=><Category key={e.id} isChecked={selectedCategories.includes(e.name)}
  onValueChange={() => toggleCategory(e.name)} categoryName={e.name}/>)
  }
  </div>
 
 
</div>




</div>



</section>


 </section>
{/* ========================================================================= */}

 <main className={CreateClasses("container",style.products_container)}>
   {
 
   allProductsData.map(({_id,price,rating,gallery,name,},index)=><Product rating={rating} imgUrl={gallery.images[gallery.featuredImage]} key={_id}  title={trim_text(name,20)} productID={_id} price={price} /> )
 
   }



 </main>

   
   
   
   </>
  )
}



// export async function getServerSideProps() {
//   // Fetch data from external API

//   // let repo = await fetch(productAPI.getAll.url);
//   // console.log(repo,"get server side props");
//   // const products = await repo.json();
//   // Pass data to the page via props
    
//   return { props: { products } }
// }
 




export default shop


export const Category = ({isChecked=false, categoryName, id=getRandomID(), onValueChange=null}) => {
  return (
    <div className="category">
      <input  
        checked={isChecked} // you forgot this!
        onChange={onValueChange} 
        type="checkbox" 
        id={id} 
        name="categories" 
        value={categoryName} 
      />
      <label htmlFor={id}>{categoryName}</label>
    </div>
  );
}
