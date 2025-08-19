import {createSlice} from "@reduxjs/toolkit";

const initialState={
    user:"",
    loginStatus:false
}
const userSlices = createSlice({

    name : "Product Slices",
    initialState,
    reducers: {

        storeUserInformation(state,{payload})
        {
            const user = payload.user;
            const loginStatus = payload.loginStatus;
            // console.log("payload",user);
            state.loginStatus = loginStatus;
            state.user = user;
            // console.log(JSON.stringify(state,null,2));
            
        }





    } // Keep reducers empty if not needed
   
});

export const {storeUserInformation} = userSlices.actions;
export default userSlices.reducer;