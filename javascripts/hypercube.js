/*
 * Rotating and Zooming 3D javascript grid.
 * I'd like to thank Thiemo for the concept,
 * which I built upon. Check out his site:
 * http://maettig.com/
 */

$ = $ || jQuery;

$(document).ready(function(){

    //Constants
    var VERT_SPACING_MAX 	= 100;
    var VERT_SPACING_MIN 	= 5;
    var RENDER_INTERVAL 	= 9; //in milliseconds. lower is smoother but more expensive

    //Object Variables
    var dimension = 1;
    var a = 0, b = 0;
    var x = 0, y = 0, z = 0;

    var vertSpacing  = 50;
    var vertSize = getVertSize();

    var vertCount = 27;
    var $window = $('#window');
    $window.text('').height($(document).height() + "px");

    //populate window with verts
    while (vertCount--)
        $window.append('<span id="l' + vertCount + '">&deg;</span>');

    var $verts = $('span');
    var $instructions = $('#instructions');

    //Functions
    function hCenterOfWindow()
    {
        return $window.offset().left + ($window.width() / 2);
    }

    function vCenterOfWindow()
    {
        return $window.offset().top + ($window.height() / 2);
    }

    function getVertSize()
    {
        return vertSpacing / 3.125;
    }

    var hCenter = hCenterOfWindow();
    var vCenter = vCenterOfWindow();

    // This is really where the magic happens.
    function render()
    {
        //loop through all 27 vertices
        vertIndex = 0;
        for (x =- dimension; x <= dimension; x += dimension)
        {
            for (y =- dimension; y <= dimension; y += dimension)
            {
                for (z =- dimension; z <= dimension; z += dimension)
                {
                    //calculate the position, size, and color of the vertices based on the mouse coordinates (a, b)
                    u = x;
                    v = y;
                    w = z;

                    u2 = u * Math.cos(a) - v * Math.sin(a);
                    v2 = u * Math.sin(a) + v * Math.cos(a);
                    w2 = w;

                    u = u2;
                    v = v2;
                    w = w2;

                    u2 = u;
                    v2 = v * Math.cos(b) - w * Math.sin(b);
                    w2 = v * Math.sin(b) + w * Math.cos(b);

                    u = u2;
                    v = v2;
                    w = w2;

                    var c = Math.round((w + 2) * 70);
                    if (c < 0) c = 0;
                    if (c > 255) c = 255;

                    //assign the calculated value to the current vertex
                    with ($verts[vertIndex].style)
                    {
                        left = hCenter + u * (w + 2) * vertSpacing;
                        top  = vCenter + v * (w + 2) * vertSpacing;
                        color = 'rgb(0, ' + c + ', 0)';
                        fontSize = (w + 2) * vertSize + "px";
                    }
                    vertIndex++;
                }
            }
        }
    }

    //Render!
    setInterval(render, RENDER_INTERVAL);

    //Bind Events
    $window
        //When the mouse moves, capture the cursor's x and y coords as (a, b)
        .bind('mousemove',
        function(e){
            a = e.clientX / 99;
            b = e.clientY / 99;
        })
        //when the mousewheel spins reset the vertex spacing and vertex size for a "zoom" effect
        .mousewheel(function(event, delta) {
            vertSpacing += delta;
            if (vertSpacing < VERT_SPACING_MIN)
                vertSpacing = VERT_SPACING_MIN;
            else if (vertSpacing > VERT_SPACING_MAX)
                vertSpacing = VERT_SPACING_MAX;

            vertSize	= getVertSize();
        });

    //Below is just the window dressing
    $instructions
        .fadeIn('slow')
        .hover(
        function(){
            $instructions.toggleClass('hover');
        },
        function(){
            $instructions.toggleClass('hover');
        });

    $(window).resize(function(){
        hCenter = hCenterOfWindow();
        vCenter = vCenterOfWindow();
        $window.height($(document).height() + "px");
    });

});