import express from 'express';
var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.get('/', async function(req, res, next) {
    let username = req.query.username
    try {
        let allPosts = await req.models.Post.find()
        if (username) {
            allPosts = await req.models.Post.find({"username": username});
        } else {
            allPosts = await req.models.Post.find();
        }
        let postData = await Promise.all(
            allPosts.map(async post => { 
                try {
                    // await call
                    let htmlPreview = await getURLPreview(post.url)

                    // information about post, added info including _id field
                    return {"id": post._id, "username": post.username, "url": post.url, "description": post.description, "likes": post.likes, "htmlPreview": htmlPreview }
                } catch(error) {
                    return {"description": post.description, "htmlPreview": "error: " + error.message};
                }
            })
        )
        res.json(postData)
    } catch (error) {
        console.error("error:", error)
        res.status(500).json({"status": "error", "error": error.message})
    }
})

router.post('/', async function(req, res, next) {
    if (req.session.isAuthenticated) {
        try {
            let newPost = new req.models.Post({
                url: req.body.url,
                username: req.session.account.username,
                description: req.body.description,
                created_date: req.body.created_date
            })
            await newPost.save()        
            res.status(200).json({"status": "success"});
        } catch (error) {
            console.log(error)
            res.send(401).json({"status": "error", "error": error})
        }
    } else {
        res.status(401).json({"status": "loggedout", "error": "not logged in"})
    }
  });

// Add handling for like here where I mark the current user as liking the given post 
router.post("/like", async (req, res, next) => {
    try {
        if (req.session.isAuthenticated) {
            let postId = req.body.postID
            let likedPost = await req.models.Post.findById(postId)
            if (!likedPost.likes.includes(req.session.account.username)) {
                likedPost.likes.push(req.session.account.username)
            }
            await likedPost.save()
            // Return the json: {"status": "success"}
            res.json({"status": "success"})
            // If there was an error, console.log it, then return json with status set to "error" and "error"
            // containing info about the error. E.g., {"status": "error", "error": error}. Also when returning
            // an error set the status to 500 (server error)
            } else {
                console.log(error.message)
                res.status(500).json({"status": "error", "error": error.message});        
            }
    // If the user isn't logged in, instead send this response (with an http status code of 401)
    } catch(error) {
        console.log(error.message)
        res.status(401).json({status: "error", error: "not logged in"})
    }
})

// Add handling for unlike here where I mark the current user as not liking the given post
router.post("/unlike", async (req, res, next) => {
    try {
        if (req.session.isAuthenticated) {
            let postId = req.body.postID
            let likedPost = await req.models.Post.findById(postId)
            if (likedPost.likes.includes(req.session.account.username)) {
                likedPost.likes.pull(req.session.account.username)
            }
            await likedPost.save()
            // Return the json: {"status": "success"}
            res.json({"status": "success"})
            // If there was an error, console.log it, then return json with status set to "error" and "error"
            // containing info about the error. E.g., {"status": "error", "error": error}. Also when returning
            // an error set the status to 500 (server error)
            } else {
                console.log(error.message)
                res.status(500).json({"status": "error", "error": error.message});        
            }
    // If the user isn't logged in, instead send this response (with an http status code of 401)
    } catch (error) {
        console.log(error.message)
        res.status(401).json({status: "error", error: "not logged in"})
    }
})

// Add handling here where I delete the given post (if you are logged in as the creator of the post)
router.delete("/", async (req, res, next) => {
    if (req.session.isAuthenticated) {
        try {
            let postId = req.body.postID
            let likedPost = await req.models.Post.findById(postId)
            if (likedPost.username !== req.session.account.username) {
                res.status(401).json({status: 'error', error: "you can only delete your own posts"})
            } else {
                await req.models.Comment.deleteMany({post: req.body.postID})
                await req.models.Post.deleteOne({_id: req.body.postID})   
            }
            res.json( {"status": "success"})
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ "status": "error", "error": error.message });        
        }
    // If the user isn't logged in, instead send this response (with an http status code of 401)
    } else {
        res.status(401).json({status: "error", error: "not logged in"})
    }
})

export default router;