import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../model/post.model.js";
import { User } from "../model/user.model.js";

import { Comment } from "../model/comment.model.js";

// export const addNewpost = async (req, res) => {
//   try {
//     const { caption } = req.body;
//     const image = req.file;
//     const authorId = req.id;

//     if (!image) {
//       return res.status(401).json({
//         message: "image required ",
//       });
//     }

//     const optimizedImageBuffer = await sharp(image.buffer)
//       .resize({ width: 800, height: 800, fit: "inside" })
//       .toFormat("jpeg", { quality: 80 })
//       .toBuffer();

//     const fileUri = ` data:image/jpeg;base64,${optimizedImageBuffer.toString(
//       "base64"
//     )}`;
//     const cloudResponse = await cloudinary.uploader.upload(fileUri);
//     const post = await Post.create({
//       caption,
//       image: cloudResponse.secure_url,
//       author: authorId,
//     });

//     const user = await User.findById(authorId);
//     if (user) {
//       user.post.push(post._id);
//       await user.save();
//     }

//     await post.populate({ path: "author", select: "-password" });
//     return res.status(201).json({
//       message: "new post added",
//       post,
//       sucess: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
export const addNewpost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({ message: "Image required" });
    }

    // Validate image buffer
    if (!image.buffer) {
      return res.status(400).json({ message: "Invalid image file" });
    }

    // Process image
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      if (!user.posts) {
        user.posts = []; // Initialize posts if not present
      }
      user.posts.push(post._id);
      await user.save();
    } else {
      return res.status(404).json({ message: "User not found" });
    }

    await post.populate({ path: "author", select: "-password" });
    return res.status(201).json({ message: "New post added", post, success: true });
  } catch (error) {
    console.error("Error in addNewpost:", error); // Log error details
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};



export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username  profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });
      
    return res.status(201).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ created: -1 })
      .populate({
        path: "author",
        select: "username,profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username,profilePicture" },
      });

    return res.status(201).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const likingUserId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({
        message: "post not found",
        success: false,
      });

    await post.updateOne({ $addToSet: { likes: likingUserId } });

    await post.save();

    //socket-io for real time notifications

    return res.status(200).json({
      message: "post liked",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const dislikePost = async (req, res) => {
  try {
    const likingUserId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({
        message: "post not found",
        success: false,
      });

    await post.updateOne({ $pull: { likes: likingUserId } }); //pull bassically remove the like

    await post.save();

    //socket-io for real time notifications

    return res.status(200).json({
      message: "post disliked",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentingUserId = req.id;

    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!text)
      return res
        .status(400)
        .json({ message: "text is required", success: false });

    const comment = await Comment.create({
      text,
      author: commentingUserId,
      post: postId,
    })


    await comment.populate({
      path: "author",
      select: "username  profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();
    return res.status(201).json({
      message: "comment added",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
}; 

export const getCommentSOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate({
      path: "author",
      select: "username profilePicture",
    });

    if (!comments)
      return res.status(404).json({
        message: "no comments",
        success: false,
      });
    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.log(error);
  }
};
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "post not found",
        success: false,
      });
    }

    if (post.author.toString() != authorId) {
      return res.status(403).json({
        message: "unauthorized",
      });
    }
    //delete post
    await Post.findByIdAndDelete(postId);

    // remove the post id from the user's post

    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() != postId);

    await user.save();

    //deleting associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: "post deleted",
    });
  } catch (error) {
    console.log(error);
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "post not found",
        success: false,
      });
    }
    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post_id)) {
      //if already bookmarked , then remove the book mark
      await user.updateOne({ $pull: { bookmarks: post_id } }); // i thinkk need some changes 
      await user.save();
      return res
        .status(200)
        .json({
          type: "unsaved",
          message: "post removed from bookmarks",
          success: true,
        });
    } else {
      // bookmarking bro jus chill out 
      await user.updateOne({ $addToSet: { bookmarks: post_id } });
      await user.save();
      return res
        .status(200)
        .json({ type: "saved", message: "post  bookmarks", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
 