import express from 'express';
var router = express.Router();

router.get("/", async (req, res) => {
    let postID = req.query.postID
    try {
        let userComments = await req.models.Comment.find({post: postID});
        res.json(userComments)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ "status": "error", "error": error.message });        
    }  
})

router.post('/', async(req, res) => {
    if (req.session.isAuthenticated) {
        // Create and save a new comment with:
        // username -  currently logged-in username (in session.account)
        // comment - from the request body (called newComment)
        // post - the postID from the request body
        // created_date  - the current date/time
        try {
            let newComment = new req.models.Comment({
                username: req.session.account.username,
                comment: req.body.newComment,
                post: req.body.postID,
                created_date: req.body.created_date
            })
            await newComment.save();
            res.json({"status": "success"});
        } catch (error) {
            console.log(error.message)
            res.status(500).json({"status": "error", "error": error.message});
        }
    } else {
        res.status(401).json({status: "error", error: "not logged in"})
    }
})

export default router;