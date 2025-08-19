import { useEffect, useState } from "react";
import Banner from "../../components/Banner/Banner";
import { CreateClasses, formatMongoDateToWords } from "../../functions/methods";
import style from "../../styles/adminPages.module.scss";
import { CiCircleRemove } from "react-icons/ci";

import { DeleteUserByID, getAllTheUsersInfo } from "../../store/slices/userMethods";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router';
import { changeOrderStatus, deleteOrderByID, getAllTheOrders } from "../../store/slices/orders";
import { toast } from "react-toastify";
import { BackEndServerImagePath } from "../../store/API/API_URL";
function ManageOrdersAdminPage() {

  const userState = useSelector((state) => state.user);
  const [allOrders, setAllOrders] = useState([]);
  const [showOrderDetails, setshowOrderDetails] = useState(false);
 // 1. Update initial state to handle multiple items
const intitalOrderDetaisl = {
  items: [], // array of products
  total: 0,
};
  const [orderDetails, setOrderDetails] = useState(intitalOrderDetaisl);
  
  const router = useRouter();




// 2. Fix showOrderDetais function
function showOrderDetais(orderData) {
  setshowOrderDetails(true);

  setOrderDetails({
    items: orderData.orderItems, // whole array
    total: orderData.totalPrice,
  });
}

  
  const handleStatusChange = async (id,status)=>
  {
       const res = await  changeOrderStatus(id,{orderStatus:status});
       if(res!==false)
       {
        toast.success("Order status changed!");
        await manage_orders();
       }

  }


  const handleDelete = async (id) => {

    if (confirm("Are you sure you want to delete this order?")) {

      console.log(`Deleted user with id: ${id}`);
      const res = await deleteOrderByID(id);
      if (res === true) {
        toast.success("Order deleted successfully!");
        await manage_orders();
      }
    }
    // Here you can call API to delete user
  };

  const manage_orders = async () => {

    const order = await getAllTheOrders();
    setAllOrders(order);

  }



  useEffect(() => {

    if (userState.loginStatus !== true || userState.user.role !== "admin") {
      router.push("/");
    }
    else {
      manage_orders();

    }


  }, [userState]);

  return (
    <>
      <Banner title="Manage Orders" />
      <main className={CreateClasses("container", style.admin_page_container)}>
        <div className={style.table_wrapper}>
          {
            allOrders.length != 0 ?
              <table className={CreateClasses(style.main_table)}>
                <thead>
                  <tr>
                    <th>Customer Account</th>
                    <th>Recipient Name</th>
                    <th>Total</th>
                    <th>Order Date</th>

                    <th>Order Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.map((order) => (
                    <tr key={order.user._id}>
                      <td>{order.user.name}</td>
                      <td>{order.shippingInfo.personName}</td>
                      <td>Rs. {order.totalPrice}</td>
                      <td>{formatMongoDateToWords(order.createdAt)}</td>


                      <td style={{ "paddingLeft": "1rem" }}>

                          <select
    value={order.orderStatus}
    onChange={(e) => handleStatusChange(order._id, e.target.value)}
    style={{
      padding: "0.3rem 0.6rem",
      borderRadius: "4px",
      border: "1px solid #ccc",
    }}
  >
    <option value="pending">Pending</option>
    <option value="processing">Processing</option>
    <option value="shipped">Shipped</option>
    <option value="delivered">Delivered</option>
    <option value="cancelled">Cancelled</option>
  </select>
                      </td>

                      
                      <td>
                        <button style={{"marginRight":"1rem"}} className="button-1" onClick={() => showOrderDetais(order)}>Detials</button>
                        <button className="button-1" onClick={() => handleDelete(order._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table> :
              <>
                <h3 className="h3">No Orders Found.</h3>
              </>
          }

        </div>

      <div className={style.orderDetailsCheckContainer}>
  {showOrderDetails && orderDetails.items.length > 0 && (
    <>
      {orderDetails.items.map((item, idx) => (
        <div className={style.cart_product} key={idx}>
          <figure className={style.cart_product_preview}>
            <img
              src={BackEndServerImagePath + item.image}
              alt={item.name}
            />
          </figure>

          <div className={style.cart_product_details}>
            <h3 className={style.cart_product_title}>{item.name}</h3>
            <p style={{ color: "black" }} className={style.cart_product_price}>
              Rs. {item.price}
            </p>
          </div>

          <span className={style.cart_item_dlt_btn}>
            Quantity: {item.quantity}
          </span>
        </div>
      ))}

      <h3 style={{ marginTop: "1rem" }}>Total: Rs. {orderDetails.total}</h3>
    </>
  )}
</div>




      </main>
    </>
  );
}

export default ManageOrdersAdminPage;
