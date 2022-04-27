const express = require('express');
const router = express.Router();


const authorController= require("../controllers/authorController")
const blogController= require("../controllers/blogsController")


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})



router.post("/author",authorController.createAuthor)

router.post("/blogs",blogController.createBlogs)

router.get("/getBlogsData",blogController.getBlogsData)

// router.get("/GetFilteredBlog",blogController.GetFilteredBlog)

// router.get("/filterData",blogController.filterData)

router.get("/filtersBlogs",blogController.filtersBlogs)

router.put("/updateData/:userId",blogController.upData)

router.put("/status/:userId",blogController.status)

// router.delete("/blogs/:blogId",blogController.deleteblog)

router.delete("/blogs/:blogsId",blogController.deleteblog)

router.delete("/delBlogs",blogController.deleteByElememt)

router.delete("/blogsDele",blogController.deleteByElememt1)











module.exports = router;