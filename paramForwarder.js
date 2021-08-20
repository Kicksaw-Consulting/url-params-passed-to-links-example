document.addEventListener('DOMContentLoaded', function () {
    // get a list of all the anchor tags (links) on this page
    const anchorTags = document.getElementsByTagName("a");
    // get a list of all the iframes on this page
    const iframes = document.getElementsByTagName("iframe");

    // convert current page query param string to URLSearchParams object, e.g., ?key=value => URLSearchParams.key = value
    const pageParams = new URLSearchParams(window.location.search);
    // convert URLSearchParams objects to regular objects, e.g., {key: "value"}
    const pageParamsObj = paramsToObject(pageParams);

    // if query params (utm params) exist
    if (window.location.search) {
        // decorate all the links
        Array.from(anchorTags).forEach((a) => {
            let link;
            // sometimes weird stuff is in the anchor tag
            try {
                // make a url object out of the anchor tag's link
                link = new URL(a.href);
            } catch {
                console.warn(`${a.href} is not a valid url. Not decorating ${a}`);
                return;
            }

            // update the href with the new link we've created
            a.href = getMergedParamsUrl(link, pageParamsObj);
        });
        // decorate all the iframes
        Array.from(iframes).forEach((iframe) => {
            // make a url object out of the iframe's source
            const link = new URL(iframe.src);
            // update the src with the new link we've created
            iframe.src = getMergedParamsUrl(link, pageParamsObj);
        })
    }
});

// convert a URLSearchParams object to a normal object
function paramsToObject(entries) {
    const result = {}
    for (const [key, value] of entries) { // each 'entry' is a [key, value] tupple
        result[key] = value;
    }
    return result;
}

// combines page params with params from some passed in url and returns the new url
function getMergedParamsUrl(url, pageParamsObj) {
    // convert the link's query param string to a URLSearchParams object
    const linkParams = new URLSearchParams(url.search);
    // then a regular object
    const linkParamsObj = paramsToObject(linkParams);
    // combine the query params from the page and the link
    url.search = new URLSearchParams({ ...pageParamsObj, ...linkParamsObj });

    return url.toString();
}