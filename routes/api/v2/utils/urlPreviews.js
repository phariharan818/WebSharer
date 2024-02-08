import fetch from 'node-fetch';
import * as cheerio from 'cheerio'
import parser, { parse } from 'node-html-parser';

const escapeHTML = str => String(str).replace(/[&<>'"]/g, 
  tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag]));

async function getURLPreview(url) {
  // TODO: Copy from your code for making url previews in A2 to make this 
  // a function that takes a url and returns an html string with a preview of that html
  try {
    if (!url) {
        console.log(error)
    }
    let response = await fetch(url)
    if (!response) {
      console.log(error)
    }

    let pageContent = await response.text();
    let html = parser.parse(pageContent)
    let metaTags = html.querySelectorAll("meta")


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
  
    const htmlResponse = `
        <div style="max-width: 300px; padding: 3px; text-align: center;"> 
            <a href="${escapeHTML(ogUrl)}" style="text-decoration: none; color: #800080;" target="_blank">
                <p style="font-size: 18px; margin-bottom: 5px;"><strong>${escapeHTML(ogTitle)}</strong></p>
                <img src="${escapeHTML(ogImage)}" style="max-height: 200px; max-width: 270px; border-radius: 8px;">
            </a>
            <p style="font-size: 14px; margin-top: 5px;"><strong>Image Alt Text:</strong> ${escapeHTML(ogAlt)}</p>
            <p style="font-size: 14px;">${escapeHTML(ogDescription)}</p>
            <p style="font-size: 14px;">${escapeHTML(ogDetailedDescription)}</p>
        </div>
    `

    return htmlResponse


  } catch (error) {
      console.log(error);
  }
}

export default getURLPreview;