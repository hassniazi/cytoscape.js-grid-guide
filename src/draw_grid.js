module.exports = function (opts, cy, debounce) {

    var options = opts;

    var changeOptions = function (opts) {
      options = opts;
    };

    var offset = function(elt) {
        var rect = elt.getBoundingClientRect();

        return {
          top: rect.top + document.documentElement.scrollTop,
          left: rect.left + document.documentElement.scrollLeft
        }
    };

    var $canvas = document.createElement('canvas');
    var $container = cy.container();
    var ctx = $canvas.getContext( '2d' );
    $container.appendChild( $canvas );

    var resetCanvas = function () {
        $canvas.height = 0;
        $canvas.width = 0;
        $canvas.style.position = 'absolute';
        $canvas.style.top = 0;
        $canvas.style.left = 0;
        $canvas.style.zIndex = options.gridStackOrder;
    };

    resetCanvas();

    var drawGrid = function() {
        var zoom = cy.zoom();
        var canvasWidth = cy.width();
        var canvasHeight = cy.height();
        var increment = options.gridSpacing*zoom;
        var incrementSmall = '8';
        var pan = cy.pan();
        var initialValueX = pan.x%increment;
        var initialValueY = pan.y%increment;

        ctx.strokeStyle = options.gridColor;
        ctx.lineWidth = options.lineWidth;

        var data = '\t<svg width="' + canvasWidth + '" height="' + canvasHeight + '" xmlns="http://www.w3.org/2000/svg">\n' +
        '<defs>\n' +
        '<pattern id="horizontalLines" width="' + increment + '" height="' + increment + '" patternUnits="userSpaceOnUse">\n' +
        '<path d="M 0 10 L ' + increment + ' 10" fill="none" stroke="' + options.gridColor + '" stroke-width="' + options.lineWidth + '" />\n' +
        '</pattern>\n' +
        '<pattern id="verticalLines" width="' + increment + '" height="' + increment + '" patternUnits="userSpaceOnUse">\n' +
        '<path d="M 10 0 L 10 ' + increment + '" fill="none" stroke="' + options.gridColor + '" stroke-width="' + options.lineWidth + '" />\n' +
        '</pattern>\n' +
        '<pattern id="smallHorizontalLines" width="' + incrementSmall + '" height="' + incrementSmall + '" patternUnits="userSpaceOnUse">\n' +
        '<path d="M 0 0 L 0 ' + incrementSmall + '" fill="none" stroke="' + options.gridColor + '" stroke-width="' + options.lineWidth + '" />\n' +
        '</pattern>\n' +
        '<pattern id="smallVerticalLines" width="' + incrementSmall + '" height="' + incrementSmall + '" patternUnits="userSpaceOnUse">\n' +
        '<path d="M 0 0 L ' + incrementSmall + ' 0" fill="none" stroke="' + options.gridColor + '" stroke-width="' + options.lineWidth + '" />\n' +
        '</pattern>\n' +
        '</defs>\n' +
        '<rect width="100%" height="100%" fill="url(#horizontalLines)" transform="translate(' + initialValueX + ', ' + initialValueY + ')" />\n' +
        '<rect width="100%" height="100%" fill="url(#verticalLines)" transform="translate(' + initialValueX + ', ' + initialValueY + ')" />\n' +
        '<rect width="100%" height="100%" fill="url(#smallHorizontalLines)" transform="translate(' + initialValueX + ', ' + initialValueY + ')" />\n' +
        '<rect width="100%" height="100%" fill="url(#smallVerticalLines)" transform="translate(' + initialValueX + ', ' + initialValueY + ')" />\n' +
        '</svg>\n';

        var img = new Image();
        data = encodeURIComponent(data);
        
        img.onload = function () {
            clearDrawing();
            ctx.drawImage(img, 0, 0);
        };
        
        img.src = "data:image/svg+xml," + data;
    };
    
    var clearDrawing = function() {
        var width = cy.width();
        var height = cy.height();

        ctx.clearRect( 0, 0, width, height );
    };

    var resizeCanvas = debounce(function() {
        $canvas.height = cy.height();
        $canvas.width = cy.width();
        $canvas.style.position = 'absolute';
        $canvas.style.top = 0;
        $canvas.style.left = 0;
        $canvas.style.zIndex = options.gridStackOrder;

        setTimeout( function() {
            $canvas.height = cy.height();
            $canvas.width = cy.width();

            var canvasBb = offset($canvas);
            var containerBb = offset($container);
            $canvas.style.top = -(canvasBb.top - containerBb.top);
            $canvas.style.left = -(canvasBb.left - containerBb.left);
            drawGrid();
        }, 0 );

    }, 250);




    return {
        initCanvas: resizeCanvas,
        resizeCanvas: resizeCanvas,
        resetCanvas: resetCanvas,
        clearCanvas: clearDrawing,
        drawGrid: drawGrid,
        changeOptions: changeOptions,
        sizeCanvas: drawGrid
    };
};
