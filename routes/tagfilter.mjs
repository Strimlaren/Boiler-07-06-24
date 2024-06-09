import { Router } from "express";

const router = Router();

import { postData } from "../public/data/postData.mjs";

/* Filter posts by selected tag */
router.get("/tag/:tagName", (_request, _response) => {
  const { tagName } = _request.params;

  /* Lowercase all tags in each tags array before checking 
  if tagName is included. */
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

export default router;
