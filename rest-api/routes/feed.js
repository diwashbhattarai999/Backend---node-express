const express = require("express");

const feedContoller = require("../controllers/feed");

const router = express.Router();

// GET /feed/posts
router.get("/posts", feedContoller.getPosts);

router.post("/posts", feedContoller.createPost);

module.exports = router;
