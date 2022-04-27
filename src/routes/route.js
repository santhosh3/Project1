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

router.get("/filterData",blogController.filterData)











module.exports = router;