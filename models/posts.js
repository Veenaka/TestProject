const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
  PostTopic: {
    type: String,
    required: true,
  },
  Postdescription: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
