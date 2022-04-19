const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const multer = require("multer");

router.get("/", (req, res) => {
  res.render("index", { title: "Home Page" });
});

router.get("/add", (req, res) => {
  res.render("add_posts", { title: "Add Users" });
});

module.exports = router;
