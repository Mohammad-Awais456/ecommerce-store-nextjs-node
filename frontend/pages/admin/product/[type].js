"use client";
import { useSearchParams } from "next/navigation";

import React, { useRef } from 'react'
import { IoMdClose } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import style from '../../../styles/sign-in.module.scss';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Banner from "../../../components/Banner/Banner";
import { CreateClasses } from "../../../functions/methods";
import { useDispatch, useSelector } from "react-redux";
import { Category } from "../../shop";
import { toast } from "react-toastify";
import { createNewProduct, getProductByID, updateSingleProductByID } from "../../../store/slices/productMethods";
import { BackEndServerImagePath } from "../../../store/API/API_URL";

function ProductEditCreate() {

  const router = useRouter();
  const userState = useSelector((state) => state.user);
  const settingsState = useSelector((state) => state.settings);
  const availableCategories = settingsState.data.productCategories;
  const [is_form_edited, set_is_form_edited] = useState(false);
  const fileInputRef = useRef(null);
  const { type: PageType, id: productId } = router.query; // 'new' or actual produc
  const initialProductState = {
    name: "",
    price: 0,
    stock: 10,
    description: "",
    categories: [],
    images: [],
    featuredImage: 0
  }
  const [productInfo, setProductInfo] = useState(initialProductState);
  // ==================================================
  const handleInputChange = (e) => {
    set_is_form_edited(true);
    const { name, value } = e.target;
    console.log( name, value);
    
    setProductInfo({
      ...productInfo,
      [name]: value
    });
  }
  // ==================================================
  const handleProductCreationAndUpdate = async () => {

    console.log(productInfo);


    if (productInfo.name.trim() === "") {
      return toast.warn("Please, enter product name!");
    }
    if (productInfo.price <= 0) {
      return toast.warn("Please, enter a valid product price!");
    }
    if (productInfo.stock < 0) {
      return toast.warn("Please, enter a valid product stock!");
    }
    if (productInfo.description.trim() === "") {
      return toast.warn("Please, enter product description!");
    }
    if (productInfo.images.length === 0) {
      return toast.warn("Please, add product images!");
    }
    if (productInfo.categories.length === 0) {
      return toast.warn("Please, select at least one category!");
    }
    let response;
    if (PageType === "new") {
      console.log(productInfo,"new product information")
      const formData = new FormData();
      formData.append("name", productInfo.name);
      formData.append("price", productInfo.price);
      formData.append("stock", productInfo.stock);
      formData.append("description", productInfo.description);
      formData.append("featuredImage", productInfo.featuredImage);

      productInfo.images.forEach(file => {
        formData.append("images", file);
      });

      productInfo.categories.forEach(category => {
        formData.append("categories", category);
      });

      // Debug check
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      response = await createNewProduct(formData);
      console.log(formData, "new product data");

      if (response !== false) {
        setProductInfo(initialProductState);
        set_is_form_edited(false);

      }
    }
    else if (PageType === "edit") {
      const formData = new FormData();
      console.log(productInfo,"updated product information")

      // Basic fields
      formData.append("name", productInfo.name);
      formData.append("price", productInfo.price);
      formData.append("stock", productInfo.stock);
      formData.append("description", productInfo.description);
      formData.append("featuredImage", productInfo.featuredImage);
      // formData.append("categories", productInfo.categories);

      // Existing images (send only their names so backend knows which ones to keep)
      productInfo.images.forEach(img => {
        if (typeof img === "string") {
          formData.append("existingImages", img);
        }
      });

      // New images (actual files)
      productInfo.images.forEach(img => {
        if (img instanceof File) {
          formData.append("images", img);
        }
      });

      // Categories
      productInfo.categories.forEach(category => {
        formData.append("categories", category);
      });

      // Send update request
      const response = await updateSingleProductByID(productId, formData );
      if (response !== false) {
        router.push("/admin/products");
      } else {
        toast.error("Error updating product!");
      }
    }

    else {
      toast.error("Invalid page type!");
    }
  };

  // ==================================================
  const removeImageFromSelection = async (removeIndex) => {
    const newSelectedImages = productInfo.images.filter((val, index) => removeIndex !== index);
    console.log(newSelectedImages);
    set_is_form_edited(true);
    setProductInfo({ ...productInfo, images: newSelectedImages, featuredImage: 0 });
    fileInputRef.current.value = null;
  }
  // ==================================================


  const categoryChangeHandler = (e) => {
    set_is_form_edited(true);

    const { value, checked } = e.target;

    if (checked) {
      setProductInfo({
        ...productInfo,
        categories: [...productInfo.categories, value]
      });
    }
    else {
      setProductInfo({
        ...productInfo,
        categories: productInfo.categories.filter(category => category !== value)
      });
    }

  }
  // ==================================================
  const displayProductInfo = async (id) => {
    const res = await getProductByID(id);
    if (res !== false) {
      setProductInfo({
        ...productInfo,
        name: res.name,
        description: res.description,
        stock: res.stock,
        price: res.price,
        images: res.gallery.images,
        featuredImage: res.gallery.featuredImage,
        categories: res.categories
      })
    }


  }

  // ==================================================

  const handleFileChange = (e) => {
    set_is_form_edited(true);

    // console.log(Array.from(e.target.files)); // store selected files in state
    setProductInfo({
      ...productInfo,
      images: [...productInfo.images, ...Array.from(e.target.files)]
    });
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!is_form_edited) return; // If the form is not edited, no need to show the dialog
      event.preventDefault();
      event.returnValue = ""; // Required for Chrome to show the confirmation dialog
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [is_form_edited])

  useEffect((e) => {


    if (userState.loginStatus !== true || userState.user.role !== "admin") {
      router.push("/");
    }
    else {
      if (PageType === "edit") {
        displayProductInfo(productId);
      }
    }

  }, [userState]);

  return (
    <>
      <Banner title={PageType === "edit" ? "Edit Product" : "Create New Product"} />
      <main className={CreateClasses("container mt-3", style.admin_page_container)}>
        <div className={style.product_images_container}>
          {
            productInfo.images.map((file, index) => <div key={index} className={CreateClasses(style.img_container, productInfo.featuredImage === index ? style.featured : "")}>
    
              <img onClick={() =>{
                 setProductInfo({ ...productInfo, featuredImage: index });
                 set_is_form_edited(true);
                }} src={`
                 ${typeof file === 'string' ? BackEndServerImagePath + file : URL.createObjectURL(file)} `} alt="product image" />
              <TiTick className={style.tick} />
              <IoMdClose onClick={() => removeImageFromSelection(index)} className={style.cross} />
            </div>)
          }



        </div>

        <form onSubmit={(e) => e.preventDefault()}>

          <br />
          <br />
          <label htmlFor="productImage" className="mt-3 button-1">Add Images</label>
          <br />
          <br />
          <br />
          <input ref={fileInputRef} id="productImage" onChange={handleFileChange} type="file" name="images" accept="image/*" multiple style={{ "display": "none" }} className=" mb-2 mt-2" />

          <label >Product Title:</label>
          <input onChange={handleInputChange} value={productInfo.name} type="text" name="name" className="common_input mb-2 mt-2" placeholder="Enter product title or name" />
          <label >Product Price:</label>
          <br />
          <br />
          <input onChange={handleInputChange} value={productInfo.price} type="text" name="price" className="common_input mb-2 " placeholder="Enter price" />
          <label >Product Stock:</label>
          <br />
          <br />
          <input onChange={handleInputChange} value={productInfo.stock} type="text" name="stock" className="common_input mb-2 " placeholder="Enter product stock" />
          <label >Select Categories:</label>
          <br />
          <br />
          <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "1rem" }}>
            {
              availableCategories.map((category) => (
                <Category
                  key={category.id}
                  id={category.id}
                  categoryName={category.name} // ✅ match destructured prop
                  isChecked={productInfo.categories.includes(category.name)}
                  onValueChange={categoryChangeHandler}
                />
              ))
            }


          </div>
          <br />
          <br />
          <label >Product Description:</label>
          <br />
          <br />
          <textarea onChange={handleInputChange} value={productInfo.description} style={{ "minHeight": "10rem", "maxHeight": "15rem", "maxWidth": "100%" }} name="description" className="common_input" placeholder="Enter product description..." />


          {
            PageType === "edit" && is_form_edited ?
              <button onClick={handleProductCreationAndUpdate} className="button-1 mt-3">Save Changes</button> : null

          }

          {
            PageType === "new" ? <button onClick={handleProductCreationAndUpdate} className="button-1 mt-3">Create Product</button>
              : null
          }
        </form>

      </main>
    </>
  )
}

export default ProductEditCreate;