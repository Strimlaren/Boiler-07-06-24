import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

// Create schema
const blogpostsSchema = mongoose.Schema({
    postedBy: {
        type: String,
    },
    avatarLink: {
        type: String,
    },
    title: {
        type: String,
    },
    postContent: {
        type: String,
    },
    likes: {
        type: Number,
    },
    tags: {
        type: [String],
    },
    comments: [
        {
            id: { type: Number },
            postedBy: { type: String },
            postedDate: { type: Date }, // Change to Date type for postedDate
            commentContent: { type: String },
        },
    ],
}, { timestamps: true }); // Automatic timestamp

// Apply the unique validator plugin to the schema
blogpostsSchema.plugin(mongooseUniqueValidator);

// Create model
const Blogposts = mongoose.model("posts", blogpostsSchema);

export default Blogposts;


/*
import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

// Create schema
const blogpostsSchema = new mongoose.Schema({
    postedBy: {
        type: String,
        required: true, 
    },
    avatarLink: {
        type: String,
    },
    title: {
        type: String
    },
    postContent: {
        type: String,
    },
    likes: {
        type: Number
    },
    tags: {
        type: [String],
    },
    comments: [
        {
            id: { type: Number },
            postedBy: { type: String },
            postedDate: { type: Date },
            commentContent: { type: String },
        }
    ]
}, { timestamps: true }); // Automatic timestamp

// Middleware to automatically generate id and postedDate for comments
blogpostsSchema.pre('save', function(next) {
    const doc = this;

    doc.comments.forEach((comment, index) => {
        if (!comment.id) {
            comment.id = index + 1; // Generate a simple unique id for the comment
        }
        if (!comment.postedDate) {
            comment.postedDate = new Date(); // Set the current date as postedDate
        }
    });

    next();
});

// Apply the unique validator plugin to the schema
blogpostsSchema.plugin(mongooseUniqueValidator);

// Create model
const Blogposts = mongoose.model("posts", blogpostsSchema);

export default Blogposts;

*/