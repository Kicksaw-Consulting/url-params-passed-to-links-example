# How to use

For quick development and testing, place this before the end of the html `</body>` tag:

```html
<!-- Param forward script -->
<script src="https://cdn.jsdelivr.net/gh/Kicksaw-Consulting/url-params-passed-to-links-example/paramForwarder.js"></script>
<!-- End param forward script -->
```

This is not what should be done for production resources. Once we're ready to move something to production, the contents of the above script should be place in the host page.
This is because the above link reads dynamically from this GitHub. If we make an update to it, every page where we've placed this snippet will also get the update, which could
be a good or bad thing--let's assume that's a bad thing.
