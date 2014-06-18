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

    // Variable to handle mouse position  
    var looper;
  
    // Current position of scrolly element
    var currentPosition = 0;
    
    var target;
    var targetDimensions = { w: 0, h: 0 };
  
    var container;
    var containerDimensions = { w: 0, h:0 };
  
    var overflowArea = { x: 0, y: 0 };

    
    // Soft object augmentation
    function extend( target, source ) {

        for ( var key in source )

            if ( !( key in target ) )

                target[ key ] = source[ key ];

        return target;
    }
  
    function start() { 
      setDimensions();
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


      targetDimensions = { w: target.width, h: target.height };
      containerDimensions = { w: container.innerWidth, h: container.innerHeight };
      overflowArea = {x: containerDimensions.w - targetDimensions.w, y: containerDimensions.h - targetDimensions.h};
    }

    function startTracking( targetElement, containerElement ) {
      
       target = targetElement;
       container = containerElement;
       
       // Bind mouse move
       // bindMouseMove();

       createViewer();
       loop();
      
      return this;
    }
  
    function onMouseMove( event ) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    }
  
    function positionTarget() {
      currentPosition += (mouse.y - currentPosition);
      var position = parseFloat(currentPosition / containerDimensions.h );
      position = Math.ceil(overflowArea.y * position) + "px";
      // TweenLite.to( target, 0.9, {
      //     y: position,
      //     ease: false,
      //     force3D: true
      // })
    }

    function main( target, container ) {

        // Parse arguments

        if ( !target || !container ) {

            throw 'You must supply a target and a container';
        }
      
        // Do it
        var scrollSystem = mouseScroll( target, container );

        return scrollSystem;
    }

    return extend( main, {
        start: start,
        stop: stop,
        resize: setDimensions
    });

})();

