
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import axios from "axios"
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'


const Signup = () => {
    const [input,setInput]=useState({
        usetname:"",
        email:"",
        password:""
    })
const navigate=useNavigate();
    const inputHandler=(e)=>{
        setInput({...input,[e.target.name]:e.target.value,})
    }
   const signupHandler=async(e)=>{
        e.preventDefault();
        console.log(input);
       try {
        const res=await axios.post("http://localhost:8000/api/v1/user/register",input,{
            headers:{
                "Content-Type":"application/json"
            },
            withCredentials:true,
        });
        if(res.data.success){
          navigate("/login")
            toast.success(res.data.message);
            setInput({usetname:"",
              email:"",
              password:""})
        }
       } catch (error) {
        console.log(error);
        
       }
        
    }

  return (
    <>
      <div className='flex items-center w-screen h-screen justify-center'>
        <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8 '>
          <div className='my-4'><h1 className='text-center font-bold text-xl' >Create an account</h1> <h1 className='font-medium text-xl'>Enter your username  email below to create your account</h1></div>
          <div>
            <Label className="">Username</Label>
            <Input value={input.username} onChange={inputHandler} type="text" name="username" className="focus-visible:ring-transparent my-1" />
          </div>
          <div>
            <Label className="">E-mail</Label>
            <Input value={input.email} onChange={inputHandler}  type="email" name="email" className="focus-visible:ring-transparent my-1" />
          </div>
          <div>
            <Label className="">Password</Label>
            <Input value={input.password} onChange={inputHandler}  type="password" name="password" className="focus-visible:ring-transparent my-1" />
          </div>
          <Button type="submit">SignUp</Button>
        <span className='text-center'>Already Have an account? <Link className='text-blue-600' to="/login">Login</Link> </span>

        </form>
      </div>
    </>
  )
}

export default Signup
