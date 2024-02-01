import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.post('/', async function(req, res, next) {
    console.log(req.body)
    try {
        let newPost = new req.models.Post({
            url: req.body.url,
            description: req.body.description,
            created_date: req.body.created_date
        })        
        await newPost.save()
        res.status(200).json({ "status": "success" });
    } catch (error) {
        res.send(500).json( {"status": "error", "error": error} )
    }
  });

router.get('/', async function(req, res, next) {
    try {
        let allPosts = await req.models.Post.find()
        let postData = await Promise.all(
            allPosts.map(async post => { 
                try {
                    // await call
                    let htmlPreview = await getURLPreview(post.url)

                    // information about post
                    return { "url": post.url, "description": post.description, "htmlPreview": htmlPreview }
                } catch(error) {
                    res.status(500).send("Error: " + error)
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