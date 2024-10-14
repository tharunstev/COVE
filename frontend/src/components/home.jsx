// eslint-disable-next-line no-unused-vars
import React from "react";
import Feed from "./feed";
import { Outlet } from "react-router-dom";
import useGetAllPosts from "@/hooks/getAllPosts";

const Home = () => {
  useGetAllPosts();
  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
        
      </div>
    </div>
  );
};

export default Home;
