import bcrypt from "bcrypt" 
import { User } from "../model/user.model.js";
import { Post } from "../model/post.model.js";
import jwt from "jsonwebtoken";
import getDatauri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
export const register=async(req,res)=>{
    try {
        const {username,email,password}=req.body;
        if(!username || !email || !password){
            return res.status(401).json({
                message:"Something is missing please check",
                success:false,
            });
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(401).json({
                message:"User already existed",
                success:false,
            })
        }
        const hashedPassword=await bcrypt.hash(password,5);
        await User.create({
            username,
            email,
            password:hashedPassword
        });
        return res.status(201).json({
            message:"Account created succesfully",
            success:true,
        });
    } catch (error) {
        console.log(error);
        
    }
}

export const login =async (req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(401).json({
                message:"Something is missing please check",
                success:false,
            });
        }

        let user=await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message:"Incorrect email or password",
                success:false,
            });
        }
                
        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch ){
            return res.status(401).json({
                message:"Incorrect email or password",
                success:false,
            });
        };

        const token=await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'});
        const populatedPosts = await Promise.all(
            user.posts.map( async (postId) => {
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        )
        user={
            _id:user._id,
            username:user.username,
            email:user.email,
            profilePicture:user.profilePicture,
            bio:user.bio,
            followers:user.followers,
            following:user.following,
            posts:populatedPosts

        }

        return res.cookie('token',token,{httpOnly:true,sameSite:'strict', maxAge:1*24*60*60*1000}).json({
            message:`Welcome back ${user.username}`,
            success:true,
            user
        })

    } catch (error) {
        console.log(error);
        
    }
}

export const logout=async(_,res)=>{
    try {
        return res.cookie("token","",{maxAge:0}).json({
            message:"logged out successfully",
            success:true
        });
    } catch (error) {
        console.log(error);
        
    }
} 

export const getProfile= async (req,res)=>{
    try {
        const userId=req.params.id;
        let user=await User.findById(userId).select("-password");
        return res.status(200).json({
            user,
            success:true,

        })
    } catch (error) {
        console.log(error);
        
    }
}

export const editProfile=async(req,res)=>{
    try {
        const userId=req.userId;
        
        const {bio,gender}=req.body;
        const profilePicture=req.file;

        let cloudResponse;
        if(profilePicture){
            const fileUri=getDatauri(profilePicture);
            cloudResponse=await cloudinary.uploader.upload(fileUri);
        }

        const user=await User.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({
                message:"user not found",
                success:false
            })
        }

        if(bio) user.bio=bio;
        if(gender) user.gender=gender;
        if(profilePicture) user.profilePicture=cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message:"profile updated",
            success:true
        })

    } catch (error) {
     console.log(error);
        
    }
}

export const followOrUnfollow =async(req,res)=>{
    try {
        const followerS=req.id;  // logged in user , like author

        const mefollwing=req.params.id; // who i follow , like her
        if(followerS==mefollwing){
            return res.status(400).json({
                message:"you cannot follow/unfollow yourself",
                success:false,

            })
        }
        const user = await User.findById(followerS);
        const targetUser=await User.findById(mefollwing);

        if(!user || targetUser){
            return res.status(400).json({
                message:"user not found",
                success:false,

            })
        }


        const isFollowing= user.following.includes(mefollwing)
        if(isFollowing){
            //unfollow
            await Promise.all([
                User.updateOne({_id:followerS},{$pull:{following:mefollwing}}),
                User.updateOne({_id:mefollwing},{$pull:{followers:followerS}}),
            ])
            return res.status(200).json({
                message:"unfollow successfully"
            })
        }
        else{
            // follow
            await Promise.all([
                User.updateOne({_id:followerS},{$push:{following:mefollwing}}),
                User.updateOne({_id:mefollwing},{$push:{followers:followerS}}),
            ])
            return res.status(200).json({
                message:"followed successfully"
            })
        }

    } catch (error) {
        console.log(error);
        
    }
}