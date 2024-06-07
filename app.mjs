import express from "express";

const app = express();

app.use(express.static("./public"));
app.use(express.json());
app.set("view engine", "ejs");

const PORT = 3000;

import { postData } from "./public/data/postData.mjs";

/* Middleware that runs on all requests (for now). Gets all unique tags
in use and attaches them to _request object for later use. */
function getAllCurrentTags(_request, _response, next) {
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
}
/* Initiate middleware to run on all requests. Can later be repositioned. */
app.use(getAllCurrentTags);

app.get("/", (_request, _response) => {
  _response.render("home", {
    postData: postData,
    pageTitle: "Blogg",
    allTags: _request.allTags,
    currentLink: "home",
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
