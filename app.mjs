import express from "express";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const PORT = 3000;

import { postData } from "./public/data/postData.mjs";
import blogPostRoutes from "./routes/blogposts.mjs";
import tagFilterRoutes from "./routes/tagfilter.mjs";
import middleware from "./middleware/middleware.mjs";

app.use(middleware);

/* Home view */
app.get("/", (_request, _response) => {
  _response.render("home", {
    postData: postData,
    pageTitle: "Blogg",
    allTags: _request.allTags,
    currentLink: "home", // Used to highlight currently browsed link.
  });
});

app.use(tagFilterRoutes);

app.use(blogPostRoutes);

app.put("/", (_request, _response) => {});

app.patch("/", (_request, _response) => {});

app.delete("/", (_request, _response) => {});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
