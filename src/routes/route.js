const express = require('express');
const router = express.Router();


const authorController= require("../controllers/authorController")
const blogController= require("../controllers/blogsController")
const loginController = require("../controllers/loginController")
const authMiddleware =require("../middleware/authMiddleware")



router.post("/authors",authorController.createAuthor1)

router.post("/blogs",authMiddleware.authentication,authMiddleware.authorization,blogController.createBlogger)

  
router.get("/getBlogs",blogController.getBlogs)  // add middleware also
    // add middleware also
// router.put("blogss/:blogId",blogController.Bloggs)    // bacha hua hai

router.put("/blogss/:blogId",authMiddleware.authentication,authMiddleware.authorization,blogController.Bloggs)
// router.put("/updateData/:blogId",authMiddleware.authentication,authMiddleware.authorization,blogController.upData)

// router.put("/status/:blogId",blogController.status)

router.delete("/blogs/:blogId",authMiddleware.authentication,authMiddleware.authorization,blogController.deleteblog)

router.delete("/deleteByElement",authMiddleware.authentication,authMiddleware.authorization,blogController.deleteByElement)

router.post("/login",loginController.loginUser)













module.exports = router;