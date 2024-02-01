import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.get('/preview', async (req, res) =>  {
    try {
        let url = req.query.url
        if (!url || !url.startsWith("http")) {
            res.status(500).send("Error: invalid URL")
        }
        let previewHTML = await getURLPreview(url)
        res.type("html")
        res.send(previewHTML)
    } catch (error) {
        console.error(error)
        res.status(500).send('Error: ' + error)
    }
  });

export default router;