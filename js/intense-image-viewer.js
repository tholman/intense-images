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

    // Variable to handle mouse position  
    var looper;
  
    // Current position of scrolly element
    var lastPosition, currentPosition = 0;
    
    var source, sourceDimensions;

    var target;
    var targetDimensions = { w: 0, h: 0 };
  
    var container;
    var containerDimensions = { w: 0, h:0 };
  
    var overflowArea = { x: 0, y: 0 };


    // Tweening.
    var tweenTime = 600; //ms
    var currentTime, startTime;

    var startPosition, endPosition, containerPosition = 1;

    var trackingPosition = 1;

    var firstTween = false;

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

    // Returns whether target a vertical or horizontal fit in container
    function getFit( source, container ) {

      var width = source.w;
      var height = source.h;

      var ratio = container.offsetHeight / source.h;

      console.log( { w: width * ratio, h: height * ratio} );
      return { w: width * ratio, h: height * ratio};

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
      setTimeout( setDimensions, 0 );
    }

    function removeViewer() {

      unbindEvents();
      document.body.removeChild( container );
    }

    function setDimensions() {

      var imageDimensions = getFit(sourceDimensions, container);
      target.width = imageDimensions.w;
      target.height = imageDimensions.h;

      targetDimensions = { w: target.width, h: target.height };
      containerDimensions = { w: container.offsetWidth, h: container.offsetHeight };
      overflowArea = {x: containerDimensions.w - targetDimensions.w, y: containerDimensions.h - targetDimensions.h};
    }

    function startTracking( imageSource ) {
      
      var img = new Image();
      img.src = imageSource;
      sourceDimensions = { w: img.width, h: img.height }; // Save original dimensions for later.
      target = img;

      container = document.createElement( 'div' );
      container.appendChild( target );

      document.body.appendChild( container );
       
      bindEvents();
      createViewer();
      loop();
      
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
      currentPosition += (mouse.x - currentPosition);

      if( mouse.x !== lastPosition ) {
        var position = parseFloat(currentPosition / containerDimensions.w );
        position = Math.ceil(overflowArea.x * position);

        target.style[ 'webkitTransform' ] = 'translate3d(' + position + 'px, 0px, 0px)';
        lastPosition = mouse.x;
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

