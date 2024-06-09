import { Router } from "express";

const router = Router();

import { postData } from "../public/data/postData.mjs";

/* Expects an array of strings. Returns an array with same strings but capitalized. Used for tags menu. */
function capitalizeArray(stringArray) {
  const capitalizedArray = stringArray.map(
    (string) => string.charAt(0).toUpperCase() + string.slice(1)
  );
  return capitalizedArray;
}
/* NOTE: THE KEYWORD "new" WILL HAVE TO BE BLOCKED AS BLOG POST TITLE 
BY VALIDATION TO AVOID ROUTING ISSUES */

/* New blog-post view */
router.get("/blog/new", (_request, _response) => {
  _response.render("createBlogView", {
    postData: postData,
    pageTitle: "Create Blog",
    allTags: _request.allTags,
    currentLink: "createblog",
  });
});

/* Create new blog */
router.post("/blog/new", (_request, _response) => {
  const formData = _request.body;
  let avatar = "";

  if (formData.avatarlink.length < 10) {
    avatar =
      "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Picture.png";
  } else {
    avatar = formData.avatarlink;
  }

  const newBlog = {
    id: postData.length + 1,
    postedBy: formData.postedby,
    avatarLink: avatar,
    postedDate: _request.dateToday,
    title: formData.title,
    postContent: formData.blogcontent,
    likes: 0,
    tags: capitalizeArray(formData.tags.split(" ")),
    comments: [],
  };

  postData.unshift(newBlog);
  _response.redirect("/");
});

/* Detailed blog view + comments */
router.get("/blog/:title", (_request, _response) => {
  const { title } = _request.params;

  /* :title is in the format 'link-to-article' */
  const postIndex = postData.findIndex(
    (post) => post.title.toLowerCase().replace(/ /g, "-") === title
  );

  _response.render("detailedView", {
    postData: postData,
    pageTitle: title,
    allTags: _request.allTags,
    currentLink: "detail",
    postIndex: postIndex,
  });
});

/* Add new blog comments */
router.post("/blog/:title", (_request, _response) => {
  const { title } = _request.params;
  const formData = _request.body;

  const postIndex = postData.findIndex(
    (post) => post.title.toLowerCase().replace(/ /g, "-") === title
  );

  const newComment = {
    id: postData[postIndex].comments.length + 1,
    postedBy: formData.name,
    postedDate: _request.dateToday,
    commentContent: formData.comment,
  };

  /* Insert the new comment first in line */
  postData[postIndex].comments.unshift(newComment);
  _response.redirect(`/blog/${title}`);
});
export default router;
