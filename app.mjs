import express from "express";

const app = express();

app.use(express.static("public"));
app.use(express.json());

const PORT = 3000;

import { postData } from "./public/data/postData.mjs";

app.get("/", (_request, _response) => {});

app.post("/", (_request, _response) => {});

app.put("/", (_request, _response) => {});

app.patch("/", (_request, _response) => {});

app.delete("/", (_request, _response) => {});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
