import { setPosts } from "@/redux/postSlice"
import axios from "axios"
// eslint-disable-next-line no-unused-vars
import React ,{useEffect} from "react"
import { useDispatch } from "react-redux"

const useGetAllPosts=()=>{
    const dispatch=useDispatch()
    useEffect(()=>{
        const fetchAllPosts=async()=>{
            try {
                const res=await axios.get("http://localhost:8000/api/v1/post/all",{withCredentials:true});
                
                if(res.data.success){
                    // console.log(res.data);
                    
                    dispatch(setPosts(res.data.posts))
                    
                    
                }
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchAllPosts()
    },[dispatch])
}
export default useGetAllPosts