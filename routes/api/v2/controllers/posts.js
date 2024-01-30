import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.post('/', async function(req, res, next) {
    console.log(req.body)
    try {
        const newPost = new req.models.Post({
            url: req.body.url,
            description: req.body.description,
            created_date: req.body.created_date
        })
    
        await newPost.save()
  
        res.status(200).json({ status: 'success', message: 'success! your post was saved successfully!' });
    } catch (error) {
        res.send(500).json( {"status": "error", "error": error} )
    }
  });

export default router;