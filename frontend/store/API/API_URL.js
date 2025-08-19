

const common_orders_path = "/api/v1/order/";
const common_product_path = "/api/v1/product";
const common_globalSettingsPath = "/api/v1/setting";
const common_user_path = "/api/v1/user";
export const BackEndServerImagePath = "http://localhost:5555/image/";
// Product API endpoints


export const contactAPIPath = "/api/v1/contact";

export const OrdersAPI = 
{
    createOrder:        { url: `${common_orders_path}/new`,         method: "POST" },
    getAllOrder:        { url: `${common_orders_path}/all`,         method: "GET" },
    deleteOrderByID:        { url: `${common_orders_path}/`,         method: "DELETE" },
    changeOrderStatus:        { url: `${common_orders_path}/change-status/`,         method: "PATCH" },

}
export const GlobalSettingsAPI = 
{
    getAllSetting:        { url: `${common_globalSettingsPath}/`,         method: "GET" },
    updateSetting:        { url: `${common_globalSettingsPath}/`,         method: "PATCH" },
    updateLogoSetting:        { url: `${common_globalSettingsPath}/update`,         method: "PATCH" },

}
export const productAPI = {
    
    getAllProducts:        { url: `${common_product_path}/all`,         method: "GET" },
    getProductByID:        { url: `${common_product_path}/`,         method: "GET" },
    createNewProduct:        { url: `${common_product_path}/new`,         method: "POST" },
    updateProductByID:        { url: `${common_product_path}/`,         method: "PATCH" },
    DeleteProductByID:        { url: `${common_product_path}/`,         method: "DELETE" },
    getAllReviews:        { url: `${common_product_path}/reviews/`,         method: "GET" },
    createNewReview:        { url: `${common_product_path}/review/`,         method: "POST" },
    updateReviewApprovedState:  { url: `${common_product_path}/review/`,         method: "PATCH" },
    deleteProductReviewByid:  { url: `${common_product_path}/review/`,         method: "DELETE" },
}
// User API endpoints
export const userAPI = {
    logout:        { url: `${common_user_path}/logout`,         method: "POST" },
    login:         { url: `${common_user_path}/login`,          method: "POST" },
    register:      { url: `${common_user_path}/register`,       method: "POST" },
    isLogin:       { url: `${common_user_path}/is-login`,       method: "POST" },
    verifyAccount: { url: `${common_user_path}/verify-account`, method: "POST" },
    requestToken:  { url: `${common_user_path}/request-token`,  method: "POST" }, 
    resetPass:     { url: `${common_user_path}/reset-password`, method: "POST" }, 
    updateProfile: { url: `${common_user_path}/profile`,       method: "PATCH" }, 
    AllUsersInfo:  { url: `${common_user_path}/users`,           method: "GET" }, 
    DeleteUser:    { url: `${common_user_path}/`,        method: "DELETE" }, 
};