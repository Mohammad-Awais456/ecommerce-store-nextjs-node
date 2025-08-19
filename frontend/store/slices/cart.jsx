// settingsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { Fetch_Data } from "../../functions/methods";

import { toast } from "react-toastify";


// 2️⃣ Initial State
const initialState = {
  cart: [],
  total:0
};

// 3️⃣ Slice
const CartSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {


   updateTotalPrice(state,{payload})
   {
    console.log(payload,"upate price payload");
    
      state.total = payload;
      return state;
    },
    updateWholeCart(state,{payload})
    {
      state.cart = payload;
      return state;
   }
   ,

  addProductToCart(state, { payload }) {
  const newProduct = payload;

  // Find if product already exists in cart
  const existingProduct = state.cart.find(
    (e) => e.productId === newProduct.productId
  );

  if (existingProduct) {
    // If exists, update quantity
    existingProduct.quantity += newProduct.quantity;
  } else {
    // Otherwise, push new product
    state.cart.push(newProduct);
  }

}
,
  // 🆕 Delete reducer
    deleteProductFromCart(state, { payload }) {
      const productId = payload; // expects productId as payload
      state.cart = state.cart.filter((item) => item.productId !== productId);

      // optional toast
      toast.info("Product removed from cart");
    }
    ,

// 🆕 One method for increment & decrement
    updateProductQuantity(state, { payload }) {
      const { productId, type:actionType } = payload;
      const product = state.cart.find((item) => item.productId === productId);

      if (!product) return;

      if (actionType === "increment") {
        product.quantity += 1;
      } else if (actionType === "decrement") {
        if (product.quantity > 1) {
          product.quantity -= 1;
        } else {
          // remove if quantity is 1
          state.cart = state.cart.filter((item) => item.productId !== productId);
          toast.info("Product removed from cart");
        }
      }
    }
  



  },
 
});

export const  {
  addProductToCart,
  updateWholeCart,
  deleteProductFromCart,
  updateProductQuantity,
  updateTotalPrice
} =CartSlice.actions;

export default CartSlice.reducer;
