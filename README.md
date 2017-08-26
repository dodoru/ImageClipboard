# ImageClipboard
---
### Paste images from clipboard to your site.
Tested on the latest versions of Chrome, Firefox, Opera and Safari.
---

### Install
```
bower install image-clipboard
```

### Usage Sample

```html
<div id="id-div-preview">
    <p>pasted imgs:</p>
</div>
<textarea id="id-text-editor" rows="20" cols="100">
    Copy an Image Into Clipboard and then Paste it Here by Ctrl+P
</textarea>

<script type="text/javascript" src="../imageClipboard.js"></script>
<script type="text/javascript">
    function hdlPaste(base64) {
        var editor = document.querySelector("#id-text-editor");
        var img = `<img src="${base64}">\n`
        editor.value = editor.value + img;
        console.log('pastedImg:', base64);
    };
    var box = new ImageClipboard('#id-div-preview', hdlPaste);

    /*
    // usage 1: active debug mode with console.log
        var box = new ImageClipboard('#id-div-preview', hdlPaste, true);
    // usage 2: set onPaste later
        var box = new ImageClipboard('#id-div-preview');
        box.onpaste = hdlPaste;
    */

</script>
```

