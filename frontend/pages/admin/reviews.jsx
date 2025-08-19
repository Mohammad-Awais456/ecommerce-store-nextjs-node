import { useEffect,useState } from "react";
import Banner from "../../components/Banner/Banner";
import { CreateClasses, formatMongoDateToWords } from "../../functions/methods";
import style from "../../styles/adminPages.module.scss";
import { DeleteUserByID, getAllTheUsersInfo } from "../../store/slices/userMethods";
import {useDispatch, useSelector} from "react-redux";
import { useRouter } from 'next/router';
import { deleteProductReviewByid, getAll_review_of_all_products, updateReviewApprovedState } from "../../store/slices/productMethods";
import { FormControlLabel, Switch } from "@mui/material";
function ReviewsAdminPage() {

  const userState = useSelector((state)=>state.user);
  const [allReviews, setAllReviews] = useState([]);
  const router = useRouter();




  const Toggle_ApprovedState = async (state,id)=>
  {
    
      const res = await updateReviewApprovedState(id,{approved:state});
      if(res!==false)
      {
          await manage_reviews();

      }
      
  }

  const handleDelete = async (id) => {

    if(confirm("Are you sure you want to delete this review?"))
    {

        const res =  await deleteProductReviewByid(id);
        if(res === true)
        {
          await manage_reviews();
        }
    }
    // Here you can call API to delete user
  };
   
  const manage_reviews = async () => {

        const res = await getAll_review_of_all_products();
        console.log(res, "this is the users data");
        setAllReviews(res);

  }


  
  useEffect(() => {
    
    if(userState.loginStatus !== true || userState.user.role !== "admin")
      {
        router.push("/");
      }
      else 
        {
       manage_reviews();

     }
  

  },[userState]);

  return (
    <>
      <Banner title="Manage Reviews" />
      <main className={CreateClasses("container", style.admin_page_container)}>
        <div className={style.table_wrapper}>
         {
        allReviews.length != 0?
        <table className={CreateClasses(style.main_table)}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Review</th>
              <th>Rating</th>
              <th>Date</th>
              <th>Approved</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allReviews.map(({_id:reviewId,rating,user,comment,DOC,approved}) => (
                <tr key={user}>
                <td>{user}</td>
                <td style={{"maxWidth":"12rem"}}>{comment}</td>
                <td>{rating}</td>
                <td>{formatMongoDateToWords(DOC)}</td>
                <td style={{"paddingLeft":"2rem"}}>

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
                            checked={approved} onChange={(e) => Toggle_ApprovedState(e.target.checked, reviewId)} />}
                          label={approved ? "Yes" : "No"}
                        />

                </td>
                <td>
                  <button className="button-1" onClick={() => handleDelete(reviewId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>:
        <>
        <h3 className="h3">No Reviews Found.</h3>
        </>
         }

                  </div>
      </main>
    </>
  );
}

export default ReviewsAdminPage;
