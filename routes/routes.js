const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const multer = require("multer");

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
        message: "User added successfully! ",
      };
      res.redirect("/");
    }
  });
});

router.get("/", (req, res) => {
  res.render("index", { title: "Home Page" });
});

router.get("/add", (req, res) => {
  res.render("add_posts", { title: "Add Posts" });
});

module.exports = router;
