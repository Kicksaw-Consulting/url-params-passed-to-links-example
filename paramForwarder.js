document.addEventListener('DOMContentLoaded', function () {
    console.log("URL forwarding initiating");
    // get a list of all the anchor tags (links) on this page
    const anchorTags = document.getElementsByTagName("a");
    // get a list of all the iframes on this page
    const iframes = document.getElementsByTagName("iframe");

    const pageParamsObj = getPageParamsObj();

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

    watchForDynamicallyRenderedAnchorTags();

    console.log("URL forwarding complete");
});

// convert a URLSearchParams object to a normal object
function paramsToObject(entries) {
    const result = {}
    for (const [key, value] of entries) { // each 'entry' is a [key, value] tupple
        result[key] = value;
    }
    return result;
}

// fetches the current page's query params and returns an object representation of them
function getPageParamsObj() {
    // convert current page query param string to URLSearchParams object, e.g., ?key=value => URLSearchParams.key = value
    const pageParams = new URLSearchParams(window.location.search);
    // convert URLSearchParams objects to regular objects, e.g., {key: "value"}
    return paramsToObject(pageParams);
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

function watchForDynamicallyRenderedAnchorTags() {
    // Select the node that will be observed for mutations
    const targetNode = document.getElementsByTagName('body')[0];

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (const addedNode of mutation.addedNodes) {
                    // nodeName is weird for some reason, but if this is an anchor tag, we want to modify the link
                    if (["A"].includes(addedNode.nodeName)) {
                        const pageParamsObj = getPageParamsObj();
                        const link = new URL(addedNode.href);
                        const decoratedHref = getMergedParamsUrl(link, pageParamsObj);
                        // replace the old link with a new, param-decorated link
                        addedNode.href = decoratedHref;
                    }
                }
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
}
