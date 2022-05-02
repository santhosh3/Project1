const express = require('express');
const router = express.Router();


const authorController= require("../controllers/authorController")
const blogController= require("../controllers/blogsController")
const loginController = require("../controllers/loginController")
const authMiddleware =require("../middleware/authMiddleware")




// -----------------------------------PHASE 1 --------------------------------------------------------------------


// router.post("/authors",authorController.createAuthor1) 

// router.post("/blogs",blogController.createBlogger)
 
// router.get("/getBlogs",blogController.getBlogs)  
    
// router.put("/blogss/:blogId",blogController.Bloggs)

// router.delete("/blogs/:blogId",blogController.deleteblog)

// router.delete("/deleteByElement",blogController.deleteByElement)


//   -------------------------------PHASE 2 --------------------------------------------------------------------



router.post("/authors",authorController.createAuthor1) 

router.post("/login",loginController.loginUser)

router.post("/blogs",authMiddleware.authentication,authMiddleware.authorization,blogController.createBlogger)
 
router.get("/blogs",authMiddleware.authentication,blogController.getBlogs)  
    
router.put("/blogs/:blogId",authMiddleware.authentication,authMiddleware.authorization,blogController.Bloggs)

router.delete("/blogs/:blogId",authMiddleware.authentication,authMiddleware.authorization,blogController.deleteblog)

router.delete("/blogs",authMiddleware.authentication,authMiddleware.authorization,blogController.deleteByElement)


module.exports = router;