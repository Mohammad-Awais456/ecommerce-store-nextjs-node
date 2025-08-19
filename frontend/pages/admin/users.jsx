import { useEffect,useState } from "react";
import Banner from "../../components/Banner/Banner";
import { CreateClasses, formatMongoDateToWords } from "../../functions/methods";
import style from "../../styles/adminPages.module.scss";
import { DeleteUserByID, getAllTheUsersInfo } from "../../store/slices/userMethods";
import {useDispatch, useSelector} from "react-redux";
import { useRouter } from 'next/router';
function UsersAdminPage() {

  const userState = useSelector((state)=>state.user);
  const [users, setUsers] = useState([]);
  const router = useRouter();




  const handleDelete = async (id) => {

    if(confirm("Are you sure you want to delete this user?"))
    {

        console.log(`Deleted user with id: ${id}`);
        const res =  await DeleteUserByID(id);
        if(res === true)
        {
          await manage_usersData();
        }
    }
    // Here you can call API to delete user
  };
   
  const manage_usersData = async () => {

        const users = await getAllTheUsersInfo();
        console.log(users, "this is the users data");
        setUsers(users);

  }


  
  useEffect(() => {
    
    if(userState.loginStatus !== true || userState.user.role !== "admin")
      {
        router.push("/");
      }
      else 
        {
       manage_usersData();

     }
  

  },[userState]);

  return (
    <>
      <Banner title="Users details" />
      <main className={CreateClasses("container", style.admin_page_container)}>
        <div className={style.table_wrapper}>
         {
        users.length != 0?
        <table className={CreateClasses(style.main_table)}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Registered Date</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
                <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{formatMongoDateToWords(user.createdAt)}</td>
                <td style={{"paddingLeft":"2rem"}}>{user.verified?"Yes":"No"}</td>
                <td>
                  <button className="button-1" onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>:
        <>
        <h3 className="h3">No Users Found.</h3>
        </>
         }

                  </div>
      </main>
    </>
  );
}

export default UsersAdminPage;
