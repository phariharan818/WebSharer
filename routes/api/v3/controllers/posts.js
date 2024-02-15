import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';


//TODO: Add handlers here
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

                    // information about post
                    return { "url": post.url, "username": post.username, "description": post.description, "htmlPreview": htmlPreview }
                } catch(error) {
                    // res.status(500).send("Error: " + error)
                    return { "description": post.description, "htmlPreview": "error: " + error.message };
                }
            })
        );
        res.json(postData)
    } catch (error) {
        console.error("Error:", error)
        res.status(500).send("Error: " + error)
    }
})


export default router;