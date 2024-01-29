import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.get('api/v2/urls/preview', async (req, res) =>  {
    res.send('this is api v2');
    getURLPreview()
  });

export default router;