async function previewUrl() {
    let url = document.getElementById("urlInput").value;
    try {
        let endpoint = await fetch("api/v1/urls/preview?url=" + url);
        if (!endpoint) {
            console.log(error)
        }
        let preview = await endpoint.text();
        displayPreviews(preview);
    } catch (error) {
        console.log(error)
        const errorHtml = `
            <div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center;"> 
                <p>${error}</p>
            </div>`
        displayPreviews(errorHtml)
        res.status(500).send("Error: " + error)
    }
}

function displayPreviews(previewHTML){
    document.getElementById("url_previews").innerHTML = previewHTML;
}
