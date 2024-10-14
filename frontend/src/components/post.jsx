/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import styled from "styled-components";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

const PostContainer = styled.div`
  margin: 2rem 0;
  width: 100%;
  max-width: 20rem;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PostImage = styled.img`
  border-radius: 0.125rem;
  margin: 0.5rem 0;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.5rem 0;
`;

const ActionIcon = styled.div`
  cursor: pointer;
  &:hover {
    color: #4b5563;
  }
`;

const LikesCount = styled.span`
  font-weight: 500;
  display: block;
  margin-bottom: 0.5rem;
`;

const Caption = styled.p`
  margin: 0;
`;

const CommentLink = styled.span`
  cursor: pointer;
  font-size: 0.875rem;
  color: #9ca3af;
`;

const CommentInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CommentInput = styled.input`
  outline: none;
  font-size: 0.875rem;
  width: 100%;
`;

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.who);
  const { posts } = useSelector((store) => store.post);
  const [like, setLike] = useState(post.likes.includes(user?._id) || false);
  const [postlike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  const changeHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPost = posts.filter(
          (postItem) => postItem?._id != post?._id
        );
        dispatch(setPosts(updatedPost));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(response.data.message);
    }
  };

  


  const likeOrDislike = async () => {
    try {
      const action = like ? "dislike" : "like";
      console.log(`Attempting to ${action} post ${post._id}`);
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post?._id}/${action}`,
        { withCredentials: true }
      );
  
      console.log("Server response:", res.data);
  
      if (res.data.success) {
        const updatedLikeCount = like ? postlike - 1 : postlike + 1;
        console.log("Updated like count:", updatedLikeCount);
        setPostLike(updatedLikeCount);
        setLike(!like);
  
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: like
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        
        console.log("Updated post data:", updatedPostData);
  
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      } else {
        toast.error("Failed to update like/dislike status.");
      }
    } catch (error) {
      console.error("Error updating like/dislike status:", error);
      toast.error("An error occurred while updating like/dislike status.");
    }
  };
  

  const commentHandler = async (postId) => {

    try {
        const res = await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`, { text }, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        console.log(res.data);
        if (res.data.success) {
            const updatedCommentData = [...comment, res.data.comment];
            setComment(updatedCommentData);

            const updatedPostData = posts.map(p =>
                p._id === post._id ? { ...p, comments: updatedCommentData } : p
            );

            dispatch(setPosts(updatedPostData));
            toast.success(res.data.message);
            setText("");
        }
    } catch (error) {
        console.log(error);
    }
}
  
const bookmarkHandler = async () => {
  try {
      const res = await axios.get(`http://localhost:8000/api/v1/post/${post?._id}/bookmark`, {withCredentials:true});
      if(res.data.success){
          toast.success(res.data.message);
      }
  } catch (error) {
      console.log(error);
  }
}
  

  return (
    <PostContainer>
      <Header>
        <UserContainer>
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="User" />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <h1 className="font-semibold text-lg">{post.author?.username}</h1>
        </UserContainer>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer text-gray-600 hover:text-gray-900 transition-colors duration-200" />
          </DialogTrigger>
          <DialogContent className="p-4 flex flex-col items-center bg-white rounded-lg shadow-lg border border-gray-200 max-w-xs">
            <div className="flex flex-col justify-end gap-2">
              <Button className="bg-red-500 text-white hover:bg-red-600">
                Unfollow
              </Button>
              <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300">
                Add to favourites
              </Button>
              {user && user?._id === post?.author._id && (
                <Button
                  onClick={deletePostHandler}
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  Delete
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </Header>
      <PostImage src={post.image} alt="Post" />
      <ActionsContainer>
        <div className="flex items-center gap-2">
          <ActionIcon>
            {like ? (
              <FaHeart
                onClick={likeOrDislike}
                className=" cursor-pointor text-red-600"
                size={"22px"}
              />
            ) : (
              <FaRegHeart onClick={likeOrDislike} size={"22px"} />
            )}
          </ActionIcon>
          <ActionIcon
            onClick={() => {
              dispatch(setSelectedPost(post));

              setOpen(true);
            }}
          >
            <MessageCircle />
          </ActionIcon>
          <ActionIcon>
            <Send />
          </ActionIcon>
        </div>
        <ActionIcon>
          <Bookmark onClick={bookmarkHandler} />
        </ActionIcon>
      </ActionsContainer>
      <LikesCount>{postlike} likes</LikesCount>
      <Caption>
        <span className="font-medium mr-2">{post.author.username}</span>
        {post.caption}
      </Caption>
      <CommentLink
        onClick={() => {
          dispatch(setSelectedPost(post));
          setOpen(true);
        }}
      >
        View all {comment.length} comment
      </CommentLink>
      <CommentDialog open={open} setOpen={setOpen} />
      <CommentInputContainer>
        <CommentInput
          type="text"
          value={text}
          onChange={changeHandler}
          placeholder="Add a comment"
        />
        {text && (
          <span onClick={()=>commentHandler(post._id)} className="cursor-pointer">
            Post
          </span>
        )}
      </CommentInputContainer>
    </PostContainer>
  );
};

export default Post;
