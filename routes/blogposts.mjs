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

/* New blog-post view */
router.get("/create-blog", (_request, _response) => {
  _response.render("createBlogView", {
    postData: postData,
    pageTitle: "Create Blog",
    allTags: _request.allTags,
    currentLink: "createblog",
  });
});
/* Create new blog */
router.post("/create-blog", (_request, _response) => {
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
export default router;
