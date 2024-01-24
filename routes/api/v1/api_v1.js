import express from 'express';
import fetch from 'node-fetch';
import parser from 'node-html-parser';
var router = express.Router();

router.get('/api/v1', async (req, res) =>  {
  res.send('this is api v1');
});


router.get('/urls/preview', async (req, res) => {
  let url = req.query.url;
  try {
    let response = await fetch(url)
    if (!response) {
      console.log(error)
    }
    let pageContent = await response.text();

    let html = parser.parse(pageContent)
    // console.log("Here is the html " + html)

    let metaTags = html.querySelectorAll('meta[property^="og:"]')
    // console.log("Here are the meta tags:" + metaTags)


    let ogUrl = ''
    let ogTitle = ''
    let ogImage = ''
    let ogDescription = ''


    // to find this information, we want to extract the values and put 
    // them in another object -> use forEach
    metaTags.forEach(tag => {
      const property = tag.getAttribute('property')
      const content = tag.getAttribute('content')
    
      if (property && property.includes('og:url')) {
        ogUrl = content || url
      } else if (property === 'og:title') {
        ogTitle = content || ''
      } else if (property === 'og:image') {
        ogImage = content || ''
      } else if (property === 'og:description') {
        ogDescription = content || ''
      }
    })

    // backup options for missing information
    if (!ogUrl) {
      ogUrl = url;
    }

    if (!ogTitle) {
      let titleTag = html.querySelector('title');
      if (titleTag) {
          ogTitle = titleTag.innerText;
      } else {
          ogTitle = url;
      }
    }
  

    // console.log("Here is a url tag " + ogUrl)
    // console.log("Here is a title tag " + ogTitle)
    // console.log("Here is an image tag " + ogImage)
    // console.log("Here is a description tag " + ogDescription)

    const htmlResponse = `
      <div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center;"> 
        <a href="${ogUrl}">
          <p><strong>${ogTitle}</strong></p>
          <img src="${ogImage}" style="max-height: 200px; max-width: 270px;">
        </a>
        <p>${ogDescription}</p>
      </div>
    `

    res.type("html")
    res.send(htmlResponse);

  } catch (error) {
      console.log(error);
      res.status(500).send("Error: " + error)
  }
});

export default router;
