/* eslint-disable no-unused-vars */

import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFile } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';
import { store } from '@/redux/store';

// eslint-disable-next-line react/prop-types
const CreatePost = ({ open, setOpen }) => {
  const imgRef = useRef();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [imgprev, setImgPrev] = useState("");
  const [loading, setLoading] = useState(false);
  const {user}=useSelector(store=>store.who)
  const {posts}=useSelector(store=>store.post)
  const dispatch=useDispatch()

  const createPostHandler = async (e) => {
    e.preventDefault(); 
    // console.log("Creating post...");

    const formData = new FormData();
    formData.append("caption", caption);
    if (imgprev) {
      formData.append("image", file);
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/api/v1/post/addpost", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });
      console.log("Response:", res);
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.error("Error:", error.response?.data); 
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFile(file);
      setImgPrev(dataUrl);
    }
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogContent onInteractOutside={() => setOpen(false)}>
          <DialogHeader>
            Create New Post
          </DialogHeader>
          <div className='flex gap-3 items-center'>
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="pimg"/>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1>{user?.username}</h1>
              <span>{user?.bio}</span>
            </div>
          </div>
          <Textarea 
            value={caption} 
            onChange={(e) => setCaption(e.target.value)} 
            className="focus-visible:ring-transparent border-none" 
            placeholder="Write a caption." 
          />
          {imgprev && (
            <div className='w-16 h-16 flex items-center justify-center'>
              <img src={imgprev} alt="imgprev" />
            </div>
          )}
          <input ref={imgRef} type="file" className='hidden' onChange={fileChangeHandler} />
          <Button onClick={() => imgRef.current.click()} className="w-fit mx-auto">Select from device</Button>
          {imgprev && (
            loading ? (
              <Button disabled>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Just A Sec
              </Button>
            ) : (
              <Button onClick={createPostHandler} type="submit" className="w-full">Post</Button>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePost;
