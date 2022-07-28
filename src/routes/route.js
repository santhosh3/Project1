const express = require('express');
const router = express.Router();


const authorConteroller= require("../controllers/authorController")
const blogController= require("../controllers/blogsController")
const loginController = require("../controllers/loginController")
const authMiddleware =require("../middleware/authMiddleware")




// -----------------------------------PHASE 1 --------------------------------------------------------------------


// router.post("/authors",authorController.createAuthor1) 

// router.post("/blogs",blogController.createBlogger)
 
// router.get("/blogs",blogController.getBlogs)  
    
// router.put("/blogs/:blogId",blogController.Bloggs)

// router.delete("/blogs/:blogId",blogController.deleteblog)

// router.delete("/blogs",blogController.deleteByElement)


//   -------------------------------PHASE 2 --------------------------------------------------------------------

router.post('/authors', authorConteroller.createAuthor1)
router.post('/login', loginController.loginAuthor)

router.post("/blogs",authMiddleware.authentication,blogController.createBlogger)
 
router.get("/blogs",authMiddleware.authentication,blogController.getBlogs)  
    
router.put("/blogs/:blogId",authMiddleware.authentication,blogController.Bloggs)

router.delete("/blogs/:blogId",authMiddleware.authentication,blogController.deleteblog)

router.delete("/blogs",authMiddleware.authentication,blogController.deleteByElement)


module.exports = router;