/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import { setUserProfile } from '@/redux/slice'
import { useDispatch } from 'react-redux'
import axios from 'axios';


const useGetuserprofile = (userId) => {
const dispatch=useDispatch();

useEffect(()=>{
    
    const fetchUserProfile=async ()=>{
        try {
            const res=await axios.get(`http://localhost:8000/api/v1/user/${userId}/profile`);
            if(res.data.success){
                dispatch(setUserProfile(res.data.user))
             
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    fetchUserProfile();
},[dispatch, userId]);
  return (
    <div>
      
    </div>
  )
}

export default useGetuserprofile
