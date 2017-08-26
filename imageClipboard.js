/*jshint boss:true, laxcomma: true, expr: true*/
!function (name, definition) {
    if (typeof module !== 'undefined') {
        module.exports = definition
    }
    else if (typeof define === 'function' && define.amd) {
        define(name, definition)
    }
    else {
        this[name] = definition
    }
}('ImageClipboard', function (selector, onpaste, debug) {
    'use strict';
    var _log = console.log.bind('console')
    var log = debug? _log: new Function();
    var self = typeof this === 'object' ? this : {};
    self.selector = selector
    self.onpaste = onpaste || _log
    self.element = document.querySelector(selector)
    self.browserSupport = true
    self.pasteCatcher = null
    self.clipImage = null

    self.init = function () {
        if (!window.Clipboard) {
            log('custom clipboard')
            //pasting not supported, make workaround
            self.browserSupport = false
            self.pasteCatcher = _makePasteCatcher()
        } else {
            self.pasteCatcher = window.Clipboard;
        }
        try {
            window.addEventListener('paste', self.pasteHandler)
            log('initImageClipboard', selector)
        } catch (error) {
            log('ImageClipboard init failed!!!');
            console.log(error);
        }
        return self
    }

    self.pasteHandler = function (e) {
        var data = e.clipboardData
        // DataTransfer
        var items = data.items
        // DataTransferItemList
        if (items) {
            self.defaultPaste(items)
        } else {
            self.customPaste(e)
        }
    }

    self.defaultPaste = function (items) {
        var images = Array.prototype.filter.call(items, function (m) {
            return m.type.indexOf("image") >= 0
        })
        Array.prototype.forEach.call(images, function (image) {
            var blob = image.getAsFile()
            var file = new FileReader()
            file.onloadend = function () {
                _loadImage(file.result)
            }
            file.readAsDataURL(blob)
        })
    }

    self.customPaste = function (e) {
        //no direct access to clipboardData (firefox)
        //use the pastecatcher
        log('customPaste', e)
        setTimeout(function () {
            var m = self.pasteCatcher.firstElementChild
            log('clipData', m)
            if (m && m.tagName === "IMG") {
                _loadImage(m.src)
            }
        }, 5)
    }

    function _makePasteCatcher() {
        // content editable div
        var pasteBox = document.createElement("div")

        pasteBox.setAttribute("id", "paste_catcher")
        pasteBox.setAttribute("contenteditable", "")
        // pasteBox.style.opacity = 0
        pasteBox.style.display = 'none'

        document.body.insertBefore(pasteBox, document.body.firstChild)

        pasteBox.focus()
        self.element.addEventListener("click", function () {
            pasteBox.focus()
        })

        return pasteBox
    }

    function createImage(source) {
        // var m = new Image()
        var m = document.createElement("img")
        m.src = source
        m.style.maxHeight = "100%"
        m.style.maxHeight = "100%"
        return m
    }

    function _loadImage(source) {
        // @source: data:image/png;base64,iVBORw0KG....
        log('load image', source.slice(0, 64))
        var m = createImage(source)
        self.clipImage = m
        self.element.appendChild(m)
        self.onpaste(source)

        if (!self.browserSupport) {
            log('clear catch', m)
            self.pasteCatcher.innerHTML = ""
        }
    }

    return self.init()
})