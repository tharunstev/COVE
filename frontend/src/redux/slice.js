import { createSlice } from "@reduxjs/toolkit";

const whoSlice=createSlice({
    name:"who",
    initialState:{
        user:null,
        userProfile:null,
    },
    reducers:{
        setWhoUser:(state,action)=>{
            state.user=action.payload;
        },
        setUserProfile:(state,action)=>{
            state.userProfile = action.payload;
        }
    }
});
export const {setWhoUser,setUserProfile}=whoSlice.actions;
export default whoSlice.reducer;

