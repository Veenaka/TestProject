const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const multer = require("multer");
const posts = require("../models/posts");
const fs = require("fs");

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

//Edit a Post route
router.get("/edit/:id", (req, res) => {
  let id = req.params.id;
  Post.findById(id, (err, post) => {
    if (err) {
      res.redirect("/");
    } else {
      if (post == null) {
        res.redirect("/");
      } else {
        res.render("edit_posts", {
          title: "Edit Post",
          post: post,
        });
      }
    }
  });
});

//Update a Post route
router.post("/update/:id", upload, (req, res) => {
  let id = req.params.id;
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("./uploads/" + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }

  Post.findByIdAndUpdate(
    id,
    {
      PostTopic: req.body.PostTopic,
      Postdescription: req.body.Postdescription,
      image: new_image,
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message, type: "danger" });
      } else {
        req.session.message = {
          type: "success",
          message: "Post updated successfully",
        };
        res.redirect("/");
      }
    }
  );
});

module.exports = router;
