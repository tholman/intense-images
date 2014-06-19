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
    
    var source;

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

    function applyProperties( target, properties ) {

      for( var key in properties ) {
        target.style[ key ] = properties[ key ];
      }
    }

    /* -------------------------
    /*          APP
    /* -------------------------*/
  
    function start() { 
      loop();
    }
 
    function loop() {
        looper = requestAnimFrame(loop);
        positionTarget();      
    }
  
    function stop() {
      cancelRequestAnimFrame( looper );
    }

    function createViewer() {

      var containerProperties = {
        'backgroundColor': 'rgba(0,0,0,0.8)',
        'width': '100%',
        'height': '100%',
        'position': 'fixed',
        'top': '0px',
        'left': '0px',
        'overflow': 'hidden'
      }

      applyProperties( container, containerProperties );

      var imageProperties = {
        'height': '100%',
        'pointerEvents': 'none',
        'webkitTransition': '-webkit-transform 800ms cubic-bezier( 0, .01, .26, 1 )'
      }

      applyProperties( target, imageProperties );

      setTimeout( setDimensions, 0 );
    }

    function setDimensions() {
      targetDimensions = { w: target.width, h: target.height };
      containerDimensions = { w: container.offsetWidth, h: container.offsetHeight };
      overflowArea = {x: containerDimensions.w - targetDimensions.w, y: containerDimensions.h - targetDimensions.h};
    }

    function startTracking( imageSource, containerElement ) {
      
      var img = new Image();
      img.src = imageSource;

      target = img;
      container = containerElement;
      container.appendChild( target );
       
      // Bind mouse move
      container.addEventListener( 'mousemove', onMouseMove, false );
      container.addEventListener( 'resize', setDimensions, false );

      createViewer();
      loop();
      
      return this;
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

    function main( src, container ) {

        // Parse arguments

        if ( !src || !container ) {

            throw 'You must supply a target and a container';
        }
      
        // Do it
        var scrollSystem = startTracking( src, container );

        return scrollSystem;
    }

    return extend( main, {
        start: start,
        stop: stop,
        resize: setDimensions
    });

})();

