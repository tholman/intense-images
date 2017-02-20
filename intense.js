window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

window.cancelRequestAnimFrame = (function() {
    return window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        clearTimeout;
})();

var Intense = (function() {

    'use strict';

    var KEYCODE_ESC = 27;

    // Track both the current and destination mouse coordinates
    // Destination coordinates are non-eased actual mouse coordinates
    var mouse = {
        xCurr: 0,
        yCurr: 0,
        xDest: 0,
        yDest: 0
    };

    var horizontalOrientation = true;
    var invertInteractionDirection = false;
    var gallery = false;

    // Holds the animation frame id.
    var looper;

    // Current position of scrolly element
    var lastPosition, currentPosition = 0;

    var sourceDimensions, target;
    var targetDimensions = {
        w: 0,
        h: 0
    };

    var container, arrowLeft, arrowRight;
    var containerDimensions = {
        w: 0,
        h: 0
    };
    var overflowArea = {
        x: 0,
        y: 0
    };

    // Overflow variable before screen is locked.
    var overflowValue;

    var active = false;

    /* -------------------------
    /*          UTILS
    /* -------------------------*/

    // Soft object augmentation
    function extend(target, source) {

        for (var key in source)

            if (!(key in target))

                target[key] = source[key];

        return target;
    }

    // Applys a dict of css properties to an element
    function applyProperties(target, properties) {

        for (var key in properties) {
            target.style[key] = properties[key];
        }
    }

    // Returns whether target a vertical or horizontal fit in the page.
    // As well as the right fitting width/height of the image.
    function getFit(source) {

        var heightRatio = window.innerHeight / source.h;

        if ((source.w * heightRatio) > window.innerWidth) {
            return {
                w: source.w * heightRatio,
                h: source.h * heightRatio,
                fit: true
            };
        } else {
            var widthRatio = window.innerWidth / source.w;
            return {
                w: source.w * widthRatio,
                h: source.h * widthRatio,
                fit: false
            };
        }
    }

    /* -------------------------
    /*          APP
    /* -------------------------*/

    function startTracking(passedElements) {

        var i;

        // If passed an array of elements, assign tracking to all.
        if (passedElements.length) {

            // Loop and assign
            for (i = 0; i < passedElements.length; i++) {
                track(passedElements[i]);
            }

        } else {
            track(passedElements);
        }
    }

    function track(element) {

        // Element needs a src at minumun.
        if (element.getAttribute('data-image') || element.src || element.href) {
            element.addEventListener('click', function(e) {
                if (element.tagName === 'A') {
                    e.preventDefault();
                }
                if (!active) {
                    active = true;
                    init(this);
                }
            }, false);
        }
    }

    function start() {
        loop();
    }

    function stop() {
        cancelRequestAnimFrame(looper);
    }

    function loop() {
        looper = requestAnimFrame(loop);
        positionTarget();
    }

    // Lock scroll on the document body.
    function lockBody() {

        overflowValue = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    }

    // Unlock scroll on the document body.
    function unlockBody() {
        document.body.style.overflow = overflowValue;
    }

    function setState(element, newClassName) {
        if (element) {
            element.className = element.className.replace('intense--loading', '');
            element.className = element.className.replace('intense--viewing', '');
            element.className += " " + newClassName;
        } else {
            // Remove element with class .view
            var elems = document.querySelectorAll('.intense--viewing');
            [].forEach.call(elems, function(el) {
                el.className = el.className.replace('intense--viewing', '').trim();
            });
        }
    }

    function createViewer(title, caption) {

        /*
         *  Container
         */

        container = document.createElement('figure');
        container.id = "figure-intense";
        container.className = "figure-intense";

        if (gallery) {

            arrowLeft = document.createElement('div');
            arrowLeft.className = "arrow-intense arrow-intense-left";
            container.appendChild(arrowLeft);

            arrowRight = document.createElement('div');
            arrowRight.className = "arrow-intense arrow-intense-right";
            container.appendChild(arrowRight);

        }

        /*
         *  Image (target)
         */

        target.className = "cursor-intense";

        container.appendChild(target);

        /*
         *  Caption Container
         */
        var captionContainer = document.createElement('figcaption');
        captionContainer.className = "caption-intense";

        /*
         *  Caption Title
         */
        if (title) {
            var captionTitle = document.createElement('h1');
            captionTitle.innerHTML = title;
            captionTitle.className = "title-intense";

            captionContainer.appendChild(captionTitle);
        }

        if (caption) {

            var captionText = document.createElement('h2');
            captionText.className = "caption-text-intense";

            captionText.innerHTML = caption;
            captionContainer.appendChild(captionText);
        }

        container.appendChild(captionContainer);

        setDimensions();

        mouse.xCurr = mouse.xDest = window.innerWidth / 2;
        mouse.yCurr = mouse.yDest = window.innerHeight / 2;

        document.body.appendChild(container);

        setTimeout(function() {
            container.style.opacity = '1';
        }, 10);
    }


    function useNext(e) {
        var currentElement = document.getElementsByClassName('intense--viewing');
        var requiredElement = currentElement[0];
        // console.log(requiredElement);

        var nextElement = requiredElement.nextElementSibling;
        // console.log(nextElement);

        if (nextElement) {
            document.body.className += "gallery-switch";
            removeViewer();
            init(nextElement);
        } else {
            arrowRight.className = 'arrow-intense-disabled';

        }
    }

    function usePrev(e) {
        var currentElement = document.getElementsByClassName('intense--viewing');
        var requiredElement = currentElement[0];
        // console.log(requiredElement);

        var prevElement = requiredElement.previousElementSibling;
        // console.log(prevElement);

        if (prevElement) {
            document.body.className += "gallery-switch";
            removeViewer();
            init(prevElement);
        } else {
            arrowLeft.className = 'arrow-intense-disabled';
        }

    }

    function removeViewer() {
        unlockBody();
        unbindEvents();
        stop();
        active = false;
        setState(false);

        var child = document.getElementById("figure-intense");
        var parent = child.parentNode;

        if (parent.hasChildNodes()) {
            parent.removeChild(child);
        } else {
            return false;
        }

    }

    function setDimensions() {

        // Manually set height to stop bug where
        var imageDimensions = getFit(sourceDimensions);
        target.width = imageDimensions.w;
        target.height = imageDimensions.h;
        horizontalOrientation = imageDimensions.fit;

        targetDimensions = {
            w: target.width,
            h: target.height
        };
        containerDimensions = {
            w: window.innerWidth,
            h: window.innerHeight
        };
        overflowArea = {
            x: containerDimensions.w - targetDimensions.w,
            y: containerDimensions.h - targetDimensions.h
        };
    }


    function checkForNext() {
        var currentElement = document.getElementsByClassName('intense--viewing');
        var requiredElement = currentElement[0];
        var nextElement = requiredElement.nextElementSibling;

        if (!nextElement) {
            arrowRight.className = 'arrow-intense-disabled';
        }
    }

    function checkForPrev() {
        var currentElement = document.getElementsByClassName('intense--viewing');
        var requiredElement = currentElement[0];
        var prevElement = requiredElement.previousElementSibling;

        if (!prevElement) {
            arrowLeft.className = 'arrow-intense-disabled';
        }
    }

    function init(element) {


        setState(element, 'intense--loading');
        var imageSource = element.getAttribute('data-image') || element.src || element.href;
        var title = element.getAttribute('data-title') || element.title;
        var caption = element.getAttribute('data-caption');

        var img = new Image();

        img.onload = function() {
            sourceDimensions = {
                w: img.width,
                h: img.height
            }; // Save original dimensions for later.
            target = this;
            createViewer(title, caption);
            lockBody();
            bindEvents();
            loop();
            setState(element, 'intense--viewing');
            if (gallery) {

              setTimeout(function(){
                document.body.className = document.body.className.replace(/\bgallery-switch\b/,'');
              }, 50);

                checkForNext();
                checkForPrev();
            }
        };

        img.src = imageSource;

    }

    function bindEvents() {

        container.addEventListener('mousemove', onMouseMove, false);
        container.addEventListener('touchmove', onTouchMove, false);
        window.addEventListener('resize', setDimensions, false);
        window.addEventListener('keyup', onKeyUp, false);
        target.addEventListener('click', removeViewer, false);

        if (gallery) {
            arrowLeft.addEventListener('click', usePrev, false);
            arrowRight.addEventListener('click', useNext, false);
        }

    }

    function unbindEvents() {

        container.removeEventListener('mousemove', onMouseMove, false);
        container.removeEventListener('touchmove', onTouchMove, false);
        window.removeEventListener('resize', setDimensions, false);
        window.removeEventListener('keyup', onKeyUp, false);
        target.removeEventListener('click', removeViewer, false);

        if (gallery) {
            arrowLeft.removeEventListener('click', usePrev, false);
            arrowRight.removeEventListener('click', useNext, false);
        }
    }

    function onMouseMove(event) {

        mouse.xDest = event.clientX;
        mouse.yDest = event.clientY;
    }

    function onTouchMove(event) {

        event.preventDefault(); // Needed to keep this event firing.
        mouse.xDest = event.touches[0].clientX;
        mouse.yDest = event.touches[0].clientY;
    }

    // Exit on excape key pressed;
    function onKeyUp(event) {

        event.preventDefault();
        if (event.keyCode === KEYCODE_ESC) {
            removeViewer();
        }
    }

    function positionTarget() {

        mouse.xCurr += (mouse.xDest - mouse.xCurr) * 0.05;
        mouse.yCurr += (mouse.yDest - mouse.yCurr) * 0.05;
        var position;

        if (horizontalOrientation === true) {

            // HORIZONTAL SCANNING
            currentPosition += (mouse.xCurr - currentPosition);
            if (mouse.xCurr !== lastPosition) {
                position = parseFloat(calcPosition(currentPosition, containerDimensions.w));
                position = overflowArea.x * position;
                target.style.webkitTransform = 'translate(' + position + 'px, 0px)';
                target.style.MozTransform = 'translate(' + position + 'px, 0px)';
                target.style.msTransform = 'translate(' + position + 'px, 0px)';
                target.style.transform = 'translate(' + position + 'px, 0px)';
                lastPosition = mouse.xCurr;
            }
        } else if (horizontalOrientation === false) {

            // VERTICAL SCANNING
            currentPosition += (mouse.yCurr - currentPosition);
            if (mouse.yCurr !== lastPosition) {
                position = parseFloat(calcPosition(currentPosition, containerDimensions.h));
                position = overflowArea.y * position;
                target.style.webkitTransform = 'translate( 0px, ' + position + 'px)';
                target.style.MozTransform = 'translate( 0px, ' + position + 'px)';
                target.style.msTransform = 'translate( 0px, ' + position + 'px)';
                target.style.transform = 'translate( 0px, ' + position + 'px)';
                lastPosition = mouse.yCurr;
            }
        }

        function calcPosition(current, total) {
            return invertInteractionDirection ? (total - current) / total : current / total;
        }

    }

    function config(options) {
        if ('invertInteractionDirection' in options) invertInteractionDirection = options.invertInteractionDirection;
        if ('gallery' in options) gallery = options.gallery;
    }

    function main(element, configOptions) {

        // Parse arguments
        if (!element) {
            throw 'You need to pass an element!';
        }

        // If they have a config, use it!
        if (configOptions) {
            config(configOptions);
        }

        startTracking(element);
    }

    return extend(main, {
        resize: setDimensions,
        start: start,
        stop: stop,
        config: config
    });
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Intense;
}
