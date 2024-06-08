import express from "express";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const PORT = 3000;

import { postData } from "./public/data/postData.mjs";

/* Expects an array of strings. Returns an array with same strings but capitalized */
function capitalizeArray(stringArray) {
  const capitalizedArray = stringArray.map(
    (string) => string.charAt(0).toUpperCase() + string.slice(1)
  );
  return capitalizedArray;
}

/* Middleware that runs on all requests (for now). Gets all unique tags
in use and attaches them to _request object for later use. */
app.use((_request, _response, next) => {
  let allTags = [];

  for (let i = 0; i < postData.length; i++) {
    for (let j = 0; j < postData[i].tags.length; j++) {
      if (!allTags.includes(postData[i].tags[j])) {
        allTags.push(postData[i].tags[j]);
      }
    }
  }

  _request.allTags = allTags;
  next();
});
/* Middleware that generates and attaches todays date to _request object. */
app.use((_request, _response, next) => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  _request.dateToday = `${year}-${month}-${day}`;
  next();
});
/* Home */
app.get("/", (_request, _response) => {
  _response.render("home", {
    postData: postData,
    pageTitle: "Blogg",
    allTags: _request.allTags,
    currentLink: "home", // Used to highlight currently browsed link.
  });
});
/* Filters posts by selected tag */
app.get("/tag/:tagName", (_request, _response) => {
  const { tagName } = _request.params;

  /* Lowercase all tags in each tags array before checking if tagName is
  included. */
  const postsFilteredByTag = postData.filter((post) => {
    return post.tags.map((tag) => tag.toLowerCase()).includes(tagName);
  });

  _response.render("filteredView", {
    postData: postData,
    pageTitle: tagName,
    allTags: _request.allTags,
    filteredPosts: postsFilteredByTag,
    currentLink: "tag",
  });
});
/* View individual posts in detailed view with comments visible */
app.get("/post/:title", (_request, _response) => {
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
/* Adds new comments */
app.post("/post/:title", (_request, _response) => {
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
  _response.redirect(`/post/${title}`);
});

app.get("/create-post", (_request, _response) => {
  _response.render("createPostView", {
    postData: postData,
    pageTitle: "Create Post",
    allTags: _request.allTags,
    currentLink: "createpost",
  });
});

app.post("/create-post", (_request, _response) => {
  const formData = _request.body;
  let avatar = "";

  if (formData.avatarlink.length < 10) {
    avatar =
      "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Picture.png";
  } else {
    avatar = formData.avatarlink;
  }

  const newPost = {
    id: postData.length + 1,
    postedBy: formData.postedby,
    avatarLink: avatar,
    postedDate: _request.dateToday,
    title: formData.title,
    postContent: formData.postcontent,
    likes: 0,
    tags: capitalizeArray(formData.tags.split(" ")),
    comments: [],
  };

  postData.unshift(newPost);
  _response.redirect("/");
});

app.put("/", (_request, _response) => {});

app.patch("/", (_request, _response) => {});

app.delete("/", (_request, _response) => {});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
