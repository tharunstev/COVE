import express from "express";
import { register,login,logout, getProfile, editProfile, followOrUnfollow } from "../controllers/user.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";

const router=express.Router();

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/:id/profile").get(isAuthenticated,getProfile);
router.route("/profile/edit").post(isAuthenticated,upload.single('profilePicture'),editProfile);
router.route("/followorunfollow/:id").post(isAuthenticated,followOrUnfollow);


export default router;