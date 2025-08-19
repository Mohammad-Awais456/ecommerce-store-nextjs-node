import { useEffect, useRef, useState } from "react";
import Banner from "../../components/Banner/Banner";
import { CreateClasses, formatMongoDateToWords, getRandomID, trim_text } from "../../functions/methods";
import style from "../../styles/adminPages.module.scss";
import { DeleteUserByID, getAllTheUsersInfo } from "../../store/slices/userMethods";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router';
import { DeleteSingleProductByID, getAllProducts, updateSingleProductByID } from "../../store/slices/productMethods";
import { BackEndServerImagePath } from "../../store/API/API_URL";
import { Switch, FormControlLabel } from "@mui/material";
import { UpdateAllSettingsFromDatabase } from "../../store/slices/globalSettingMethods";
import { fetchSettingsAndUpdate } from "../../store/slices/globalSettings";
import { toast } from "react-toastify";
import Link from "next/link";

function UsersAdminPage() {

  const categoryChangedTimer = useRef(null);
  const userState = useSelector((state) => state.user);
  const settingsState = useSelector((state) => state.settings);
  const [allProducts, setProducts] = useState([]);
  const [allCategroies, setAllCategories] = useState([]);
  const categoryIntialsState = { name: "", id: "" };
  const [NewCategroy, setNewCategory] = useState(categoryIntialsState);
  const dispatch = useDispatch();
  const Toggle_Product_Featured = async (isChecked, id) => {
    // setChecked(event.target.checked);
    console.log(isChecked, id);
    const createNewFormData = new FormData();
    createNewFormData.append("featuredProduct",isChecked)
    const updatedProductResponse = await updateSingleProductByID(id,  createNewFormData)
    if (updatedProductResponse === true) {
      await getProducts();
    }
    else {
      console.log("Error updating product");
    }
  };
  const router = useRouter();


  //  fucntions 
  const handleNewCategoryChange = (e) => {
    const { value, name } = e.target;
    setNewCategory({ ...NewCategroy, [name]: value.toLowerCase() });
  }

  // =============================
  const addNewCategory = async () => {
    if (NewCategroy.name.trim() === "") {
      return toast.warn("Please, enter a category name!");
    }
    const updatedSetting = { productCategories: [...settingsState.data.productCategories, { ...NewCategroy, id: getRandomID() }] }
    console.log(updatedSetting);

    const res = await UpdateAllSettingsFromDatabase({ id: settingsState.data._id, updatedFields: updatedSetting });
    setNewCategory(categoryIntialsState);
    if (res !== false) {
      dispatch(fetchSettingsAndUpdate());
    }

  }

  // =============================
  const deleteCategory = async (id) => {

    if (confirm("Are you sure you want to delete this category?")) {
      const updatedCategories = allCategroies.filter(category => category.id !== id);
      setAllCategories(updatedCategories);

      const updatedSetting = { productCategories: updatedCategories };
      const res = await UpdateAllSettingsFromDatabase({
        id: settingsState.data._id,
        updatedFields: updatedSetting,
      });
      if (res !== false) {
        dispatch(fetchSettingsAndUpdate());
        toast.success("Category deleted successfully!");
      }

    }

  }
  // =============================
  const categoryUpdateHandler = (value, id) => {
    clearTimeout(categoryChangedTimer.current);

    const newCategories = allCategroies.map(category =>
      category.id === id ? { ...category, name: value.toLowerCase() } : category
    );
    setAllCategories(newCategories);

    categoryChangedTimer.current = setTimeout(async () => {

      if (newCategories.some(category => !category.name.trim())) {
        toast.warn("Empty category is not allowed!");
        return;
      }

      const updatedSetting = { productCategories: newCategories };
      const res = await UpdateAllSettingsFromDatabase({
        id: settingsState.data._id,
        updatedFields: updatedSetting,
      });
      if (res !== false) toast.success("Category updated successfully!");
    }, 1000);
  };
  // =============================
  const handleDelete = async (id) => {

    if (confirm("Are you sure you want to delete this product?")) {

      // console.log(`Deleted user with id: ${id}`);
      const res = await DeleteSingleProductByID(id);
      if (res === true) {
        await getProducts();
      }
    }
    // Here you can call API to delete user
  };

  const getProducts = async () => {

    const products = await getAllProducts();
    setProducts(products);

  }

  const displayAllCategories = () => {

    console.log(settingsState);

    setAllCategories(settingsState.data.productCategories);

  }

  useEffect(() => {

    if (userState.loginStatus !== true || userState.user.role !== "admin") {
      router.push("/");
    }
    else {
      getProducts();

    }


  }, [userState]);
  useEffect(() => {

    if (!(userState.loginStatus !== true || userState.user.role !== "admin")) {
      displayAllCategories();
    }


  }, [settingsState]);

  return (
    <>
      <Banner title="Manage Products" />
      <main className={CreateClasses("container", style.admin_page_container)}>
        <div className={style.table_wrapper}>
          {
            allProducts.length !== 0 ?

              <table className={CreateClasses(style.main_table)}>
                <thead>
                  <tr>
                    <th>Preview</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Featured Product</th>
                    <th>Created On</th>
                    <th>price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allProducts.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img src={`${BackEndServerImagePath}${product.gallery.images[product.gallery.featuredImage]}`} alt={product.name} style={{ width: "50px", height: "50px" }} />

                      </td>
                      <td>{trim_text(product.name,25)}</td>
                      <td>{
                        product.categories.length !== 0 ?
                          product.categories.join(", ")
                          : "No Category"

                      }</td>

                      <td>
                        <FormControlLabel
                          control={<Switch
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#fff", // Thumb color when checked
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                backgroundColor: "#4caf50", // Track color when checked
                              },

                              "& .MuiSwitch-track": {
                                backgroundColor: "#bdbdbd", // Track color when unchecked
                              },
                            }}
                            checked={product.featuredProduct} onChange={(e) => Toggle_Product_Featured(e.target.checked, product._id)} />}
                          label={product.featuredProduct ? "ON" : "OFF"}
                        />
                      </td>


                      <td>{formatMongoDateToWords(product.DOC)}</td>
                      <td style={{ "paddingLeft": "2rem" }}>Rs. {product.price}</td>
                      <td >
                        <Link href={`/admin/product/edit?id=${product._id}`} className="mr-1 small_button-1" >Edit</Link>
                        <button className="small_button-1" onClick={() => handleDelete(product._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              :
              <h3>No product found!</h3>
          }
        </div>
        <button className="button-1 mt-1" onClick={() => router.push("/admin/product/new")}>Create New Product</button>
        <p className="mt-2">Click the button above to create a new product. You can also edit existing products by clicking the "Edit" button next to each product.</p>
        <section className=" manageProductCategories">
          <h2 className="h3 mt-3 mb-1 upper">Manage Product Categories:</h2>
          <p>Here you can manage product categories. You can add, edit, or delete categories as needed.</p>

          <br />
          <br />

          <div className={style.single_category}>

            <input onChange={handleNewCategoryChange} value={NewCategroy.name} type="text" className="common_input" placeholder="New Category Name" name="name" />
            <button onClick={addNewCategory} className="small_button-1 ">Add it</button>
          </div>

          {
            allCategroies.map(({ id, name }, index) => <div key={index} className={style.single_category}>

              <input onChange={(e) => categoryUpdateHandler(e.target.value, id)} type="text" value={name} className="common_input" placeholder={name} name={name} />
              <button onClick={() => deleteCategory(id)} className="small_button-1 ">Remove</button>
            </div>)
          }
          {
            allCategroies.length === 0 && <p className="mt-2">No categories found. Please add a category to manage products.</p>
          }





        </section>
      </main>
    </>
  );
}

export default UsersAdminPage;
