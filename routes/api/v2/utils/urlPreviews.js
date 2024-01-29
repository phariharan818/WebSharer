import fetch from 'node-fetch';

import parser from 'node-html-parser';

async function getURLPreview(url) {
  // TODO: Copy from your code for making url previews in A2 to make this 
  // a function that takes a url and returns an html string with a preview of that html
  try {
    let response = await fetch(url)
    if (!response) {
      console.log(error)
    }
    let pageContent = await response.text();

    let html = parser.parse(pageContent)
    // console.log("Here is the html " + html)

    let metaTags = html.querySelectorAll("meta")
    // console.log("Here are the meta tags:" + metaTags)


    let ogUrl = ''
    let ogTitle = ''
    let ogImage = ''
    let ogDescription = ''
    let ogAlt = ''
    let ogDetailedDescription = ''


    // to find this information, we want to extract the values and put 
    // them in another object -> use forEach
    metaTags.forEach(tag => {
      const property = tag.getAttribute('property')
      const content = tag.getAttribute('content')
      const name = tag.getAttribute('name')
    
      if (property && property.includes('og:url')) {
        ogUrl = content || url
      } else if (property == 'og:title') {
        ogTitle = content || ''
      } else if (property === 'og:image') {
        ogImage = content || ''
      } else if (property == 'og:description') {
        ogDescription = content || ''
      } else if (property == 'og:image:alt') {
        ogAlt = content || ''
      } else if (name == 'description') {
        ogDetailedDescription = content
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

    if (!ogImage) {
      ogImage = 'No image found'
    }

    if (!ogAlt) {
      ogAlt = 'No image description found'
    }

    if (ogDescription === ogDetailedDescription) {
      ogDetailedDescription = ''
    }    

    if (!ogDetailedDescription) {
      ogDetailedDescription = ''
    }
  

    // console.log("Here is a url tag " + ogUrl)
    // console.log("Here is a title tag " + ogTitle)
    // console.log("Here is an image tag " + ogImage)
    // console.log("Here is a description tag " + ogDescription)
    // console.log("Here is a detailed description " + ogDetailedDescription)

    const htmlResponse = `
      <div style="max-width: 800px; border: solid 2px #333; text-align: center; background-color: #f8f8f8; border-radius: 10px;">
        <a href="${ogUrl}" style="text-decoration: none; color: #800080;" target="_blank">
          <p style="font-size: 28px; margin-bottom: 5px;"><strong>${ogTitle}</strong></p>
          <img src="${ogImage}" style="max-height: 300px; max-width: 100%; border-radius: 8px;">
        </a>
        <p style="font-size: 24px; margin-bottom: 18px; margin-top: 15px;"><strong>Image Alt Text:</strong> ${ogAlt}</p>
        <p style="font-size: 18px; margin-top: 20px;">${ogDescription}</p>
        <p style="font-size: 18px; margin-top: 20px;">${ogDetailedDescription}</p>
      </div>
    `


    res.type("html")
    res.send(htmlResponse);

  } catch (error) {
      console.log(error);
      res.status(500).send("Error: " + error)
  }
}

export default getURLPreview;