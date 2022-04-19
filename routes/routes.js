const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const multer = require("multer");
const posts = require("../models/posts");

// image upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("image");

// Insert a post into database route
router.post("/add", upload, (req, res) => {
  const post = new Post({
    PostTopic: req.body.PostTopic,
    Postdescription: req.body.Postdescription,
    image: req.file.filename,
  });
  post.save((err) => {
    if (err) {
      res.json({ message: err.message, type: "danger" });
    } else {
      req.session.message = {
        type: "success",
        message: "Post added successfully! ",
      };
      res.redirect("/");
    }
  });
});

//Get all posts route

router.get("/", (req, res) => {
  Post.find().exec((err, posts) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.render("index", {
        title: "Home Page",
        posts: posts,
      });
    }
  });
});

router.get("/add", (req, res) => {
  res.render("add_posts", { title: "Add Posts" });
});

module.exports = router;
