import {createSlice} from "@reduxjs/toolkit";
import { fetchAllProducts } from "./productMethods";
import { toast } from "react-toastify";

const initialState={
    products:[],
    loading:false,
    error:null
}
const ProductSlices = createSlice({

    name : "Product Slices",
    initialState,
    reducers: {

        productsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
          UpdateProductsInStore(state,{payload})
        {
            const products = payload.products;
            state.products= products;

            // console.log(JSON.stringify(state,null,2));
            
        }



    }
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(fetchAllProducts.pending, (state) => {
    //             state.loading = true;
    //             state.error = null; // Reset error on new request
    //         })
    //         .addCase(fetchAllProducts.fulfilled, (state, action) => {
    //             state.loading = false;
    //             state.products = action.payload; // Assuming payload contains the product data
    //         })
    //         .addCase(fetchAllProducts.rejected, (state, action) => {
    //             state.loading = false;
    //             state.error = action.error.message; // Set the error message
    //         });
    // },
});

export const {UpdateProductsInStore,productsLoading} = ProductSlices.actions;

export default ProductSlices.reducer;