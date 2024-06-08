import express from "express";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");

const PORT = 3000;

import { postData } from "./public/data/postData.mjs";

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

app.get("/create-post", (_request, _response) => {
  _response.render("createPostView", {
    postData: postData,
    pageTitle: "Create Post",
    allTags: _request.allTags,
    currentLink: "createpost",
  });
});

app.post("/create-post", (_request, _response) => {});

app.put("/", (_request, _response) => {});

app.patch("/", (_request, _response) => {});

app.delete("/", (_request, _response) => {});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
