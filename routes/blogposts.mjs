import { Router } from "express";
import Blogposts from "../models/blogpostsModel.js";
// import { extractAllTags } from "../utils/extractAllTags.js";

const router = Router();

// import { postData } from "../public/data/postData.mjs";

/* Expects an array of strings. Returns an array with same strings but capitalized. Used for tags menu. */
function capitalizeArray(stringArray) {
  const capitalizedArray = stringArray.map(
    (string) => string.charAt(0).toUpperCase() + string.slice(1)
  );
  return capitalizedArray;
}
/* NOTE: THE KEYWORD "new" WILL HAVE TO BE BLOCKED AS BLOG POST TITLE 
BY VALIDATION TO AVOID ROUTING ISSUES */

// GET request to render the create blog view
router.get("/blog/new", async (_request, _response) => {
  try {
    // Fetch all blog posts from the database (optional for rendering if needed)
    const blogposts = await Blogposts.find();

    _response.render("createBlogView", {
      pageTitle: "Create Blog",
      currentLink: "createblog",
      blogposts: blogposts, // Optional: Pass blogposts data if needed in the view
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error.message);
    _response.status(500).json({ message: "Error fetching blog posts" });
  }
});

/* Handle form submission */
router.post("/blog/new", async (req, res) => {
  try {
    const { postedBy, avatarLink, title, postContent, tags } = req.body;

    // Convert the tags from a space-separated string to an array
    const tagsArray = tags.split(" ").map(tag => tag.trim());

    // Create a new blog post
    const newBlog = new Blogposts({
      postedBy,
      avatarLink,
      title,
      postContent,
      tags: tagsArray,
      likes: 0,
      comments: []
    });

    await newBlog.save();

    // Fetch all blog posts to pass to the view
    const blogposts = await Blogposts.find();

    res.status(201).render("createBlogView", {
      pageTitle: "Create Blog",
      currentLink: "createblog",
      blogposts,
      newBlog
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({
      message: "Failed to create blog post",
      error: error.message,
    });
  }
});

/* Detailed blog view + comments */
router.get("/blog/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the specific blog post by I
    const blogposts = await Blogposts.find();
    const blogpost = await Blogposts.findById(id);

    if (!blogpost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.render("detailedView", {
      blogposts : blogposts,
      blogpost: blogpost,
      pageTitle: blogpost.title,
      currentLink: "detail",
    });
  } catch (error) {
    console.error("Error fetching blog post:", error.message);
    res.status(500).json({ message: "Error fetching blog post" });
  }
});
/* Add new blog comments */
router.post("/blog/:id", async (_request, _response) => {
  const { id } = _request.params;
  const formData = _request.body;

  try {
    // Fetch the specific blog post by ID
    const blogpost = await Blogposts.findById(id);

    if (!blogpost) {
      return _response.status(404).json({ message: "Blog post not found" });
    }

    // Create the new comment
    const newComment = {
      postedBy: formData.name,
      postedDate: new Date(),
      commentContent: formData.comment,
    };

    // Insert the new comment first in line
    blogpost.comments.unshift(newComment);

    // Save the updated blog post
    await blogpost.save();

    // Fetch all blog posts again for rendering (optional, depending on your use case)
    const blogposts = await Blogposts.find();

    _response.render("detailedView", {
      blogposts: blogposts,
      blogpost: blogpost,
      pageTitle: blogpost.title,
      currentLink: "detail",
    });
  } catch (error) {
    console.error("Error adding comment:", error.message);
    _response.status(500).json({
      message: "Failed to add comment",
      error: error.message,
    });
  }
});

export default router;
