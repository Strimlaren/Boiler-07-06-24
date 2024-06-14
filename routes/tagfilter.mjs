import { Router } from "express";
import Blogposts from "../models/blogpostsModel.js";

const router = Router();

/* Filter posts by selected tag */
router.get("/tag/:tagName", async (req, res) => {
  const { tagName } = req.params;

  try {
    // Fetch all blog posts from the database
    const blogposts = await Blogposts.find();

    // Filter posts by the selected tag
    const postsFilteredByTag = blogposts.filter((post) => {
      return post.tags.map((tag) => tag.toLowerCase()).includes(tagName.toLowerCase());
    });

    res.render("filteredView", {
      blogposts: blogposts,
      pageTitle: tagName,
      allTags: req.allTags, // Assuming `allTags` is set somewhere in the request
      filteredPosts: postsFilteredByTag,
      currentLink: "tag",
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error.message);
    res.status(500).json({ message: "Error fetching blog posts" });
  }
});

export default router;
