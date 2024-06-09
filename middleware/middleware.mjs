import { Router } from "express";

const router = Router();

import { postData } from "../public/data/postData.mjs";

/* Gets all unique tags in use and attaches them 
to _request object. */
router.use((_request, _response, next) => {
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
/* Generates and attaches todays date to _request object. */
router.use((_request, _response, next) => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  _request.dateToday = `${year}-${month}-${day}`;
  next();
});

export default router;
