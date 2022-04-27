const express = require('express');
const router = express.Router();


const authorController= require("../controllers/authorController")
const blogController= require("../controllers/blogsController")



router.post("/author",authorController.createAuthor)

router.post("/blogs",blogController.createBlogger)

router.get("/getBlogsData",blogController.getBlogsData)

router.get("/getblog",blogController.getblog)

router.put("/updateData/:blogId",blogController.upData)

router.put("/status/:userId",blogController.status)

router.delete("/blogs/:blogId",blogController.deleteblog)

// router.delete("/lastDelete",blogController.lastDelete)











module.exports = router;