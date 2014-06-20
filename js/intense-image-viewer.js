window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

window.cancelRequestAnimFrame = ( function() {
    return window.cancelAnimationFrame          ||
        window.webkitCancelRequestAnimationFrame    ||
        window.mozCancelRequestAnimationFrame       ||
        window.oCancelRequestAnimationFrame     ||
        window.msCancelRequestAnimationFrame        ||
        clearTimeout
} )();


// Using GSAPS Tween light
var imageViewer = (function() {

    'use strict';
    // TODO: Extend module to allow horizontal and vertical 
    var mouse = { x:0, y:0 };
    var mouseEvent;

    var horizontalOrientation = true;

    // Holds the animation frame id.
    var looper;
  
    // Current position of scrolly element
    var lastPosition, currentPosition = 0;
    
    var source, sourceDimensions;

    var target;
    var targetDimensions = { w: 0, h: 0 };
  
    var container;
    var containerDimensions = { w: 0, h:0 };
  
    var overflowArea = { x: 0, y: 0 };


    /* -------------------------
    /*          UTILS
    /* -------------------------*/

    // Soft object augmentation
    function extend( target, source ) {

        for ( var key in source )

            if ( !( key in target ) )

                target[ key ] = source[ key ];

        return target;
    }

    // Applys a dict of css properties to an element
    function applyProperties( target, properties ) {

      for( var key in properties ) {
        target.style[ key ] = properties[ key ];
      }
    }

    // Returns whether target a vertical or horizontal fit in container.
    // As well as the right fitting width/height of the image.
    function getFit( source, container ) {

      var heightRatio = container.offsetHeight / source.h;

      if( (source.w * heightRatio) > container.offsetWidth ) {
        return { w: source.w * heightRatio, h: source.h * heightRatio, fit: true };
      } else {
        var widthRatio = container.offsetWidth / source.w;
        return { w: source.w * widthRatio, h: source.h * widthRatio, fit: false };
      }
    }

    /* -------------------------
    /*          APP
    /* -------------------------*/
  
    function start() { 
      loop();
    }
   
    function stop() {
      cancelRequestAnimFrame( looper );
    }

    function loop() {
        looper = requestAnimFrame(loop);
        positionTarget();      
    }

    function createViewer() {

      var containerProperties = {
        'backgroundColor': 'rgba(0,0,0,0.8)',
        'width': '100%',
        'height': '100%',
        'position': 'fixed',
        'top': '0px',
        'left': '0px',
        'overflow': 'hidden',
        'zIndex': '999999'
      }

      applyProperties( container, containerProperties );

      var imageProperties = {
        'webkitTransition': '-webkit-transform 800ms cubic-bezier( 0, 0, .26, 1 )',
        'pointerEvents': 'none'
      }

      applyProperties( target, imageProperties );
      setDimensions();
    }

    function removeViewer() {

      unbindEvents();
      document.body.removeChild( container );
    }

    function setDimensions() {

      // Manually set height to stop bug where 
      var imageDimensions = getFit(sourceDimensions, container);
      target.width = imageDimensions.w;
      target.height = imageDimensions.h;
      horizontalOrientation = imageDimensions.fit;

      targetDimensions = { w: target.width, h: target.height };
      containerDimensions = { w: container.offsetWidth, h: container.offsetHeight };
      overflowArea = {x: containerDimensions.w - targetDimensions.w, y: containerDimensions.h - targetDimensions.h};
    }

    function startTracking( imageSource ) {
      
      var img = new Image();
      img.onload = function() {

        sourceDimensions = { w: img.width, h: img.height }; // Save original dimensions for later.

        container = document.createElement( 'div' );
        container.appendChild( target );
        document.body.appendChild( container );
         
        bindEvents();
        createViewer();
        loop();
      }

      img.src = imageSource;
      target = img;
      
      return this;
    }

    function bindEvents() {
      container.addEventListener( 'mousemove', onMouseMove, false );
      window.addEventListener( 'resize', setDimensions, false );
      container.addEventListener( 'click', removeViewer, false )
    }

    function unbindEvents() {
      container.removeEventListener( 'mousemove', onMouseMove, false );
      window.removeEventListener( 'resize', setDimensions, false );
      container.removeEventListener( 'click', removeViewer, false )
    }
  
    function onMouseMove( event ) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    }
  
    function positionTarget() {

      if ( horizontalOrientation === true ) {

        // HORIZONTAL SCANNING
        currentPosition += (mouse.x - currentPosition);
        if( mouse.x !== lastPosition  ) {

          var position = parseFloat(currentPosition / containerDimensions.w );
          position = Math.ceil(overflowArea.x * position);
          target.style[ 'webkitTransform' ] = 'translate3d(' + position + 'px, 0px, 0px)';
          lastPosition = mouse.x;

        }
      } else if ( horizontalOrientation === false ) {

        // VERTICAL SCANNING
        currentPosition += (mouse.y - currentPosition);
        if( mouse.y !== lastPosition  ) {
          var position = parseFloat(currentPosition / containerDimensions.h );
          position = Math.ceil(overflowArea.y * position);
          target.style[ 'webkitTransform' ] = 'translate3d( 0px, ' + position + 'px, 0px)';
          lastPosition = mouse.y;
        }
      }
    }

    function main( src ) {

        // Parse arguments

        if ( !src ) {

            throw 'You must pass an image source';
        }
      
        // Do it
        var scrollSystem = startTracking( src );

        return scrollSystem;
    }

    return extend( main, {
        resize: setDimensions,
        start: start,
        stop: stop
    });

})();

