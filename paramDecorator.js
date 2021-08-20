document.addEventListener('DOMContentLoaded', function () {
    // get a list of all the anchor tags (links) on this page
    const anchorTags = document.getElementsByTagName("a");

    // if query params (utm params) exist
    if (window.location.search) {
        Array.from(anchorTags).forEach((a) => {
            // convert current page query param string to URLSearchParams object, e.g., ?key=value => URLSearchParams.key = value
            const pageParams = new URLSearchParams(window.location.search);
            // make a url object out of the anchor tag's link
            const link = new URL(a.href);
            // convert the link's query param string to a URLSearchParams object
            const linkParams = new URLSearchParams(link.search);

            // convert URLSearchParams objects to regular objects, e.g., {key: "value"}
            const pageParamsObj = paramsToObject(pageParams);
            const linkParamsObj = paramsToObject(linkParams);

            // combine the objects from both, update the query params
            link.search = new URLSearchParams({ ...pageParamsObj, ...linkParamsObj });
            // update the href with the new link we've created
            a.href = link.toString();
        });
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