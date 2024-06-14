import express from "express";
import { connectDB } from "./utils/db.js";
import Blogposts from "./models/blogpostsModel.js";
import bodyParser from 'body-parser';
// import { extractAllTags } from "./utils/extractAllTags.js";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
// Middleware to parse URL-encoded bodies (form data)
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to parse JSON bodies
app.use(bodyParser.json());

const PORT = 3000;

// Connect to MongoDB
connectDB();

/* Home view */
app.get("/", async (_request, _response) => {
    try {
        const blogposts = await Blogposts.find();

        if (!blogposts) {
            throw new Error("No blog posts found");
        }

        _response.render("home", {
            blogposts: blogposts,
            pageTitle: "Blogg",
            currentLink: "home",
        });
    } catch (error) {
        console.error("Error fetching or rendering blog posts:", error.message);
        _response.status(500).json({ message: "Error fetching or rendering blog posts" });
    }
});


// Middleware and routes
import blogPostRoutes from "./routes/blogposts.mjs";
import tagFilterRoutes from "./routes/tagfilter.mjs";
import middleware from "./middleware/middleware.mjs";

app.use(middleware);
app.use(tagFilterRoutes);
app.use(blogPostRoutes);

// Placeholder routes for other HTTP methods
app.put("/", (_request, _response) => {});
app.patch("/", (_request, _response) => {});
app.delete("/", (_request, _response) => {});

// Start the server
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
