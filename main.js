// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
let canvas = document.querySelector("#mycanvas");
let label = document.querySelector("#label");
//canvas.style.width = window.innerWidth + "px";
PIXI.settings.RESOLUTION = window.devicePixelRatio;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
const app = new PIXI.Application({view: canvas, forceCanvas:false, transparent:true, antialias: false});
let ctrlIsPressed = false;
let drawing = false;
canvas.focus();
window.addEventListener('resize', resize);

// Resize function window
function resize() {
	// Resize the renderer
	app.renderer.resize(window.innerWidth, window.innerHeight);
  
  // You can use the 'screen' property as the renderer visible
  // area, this is more useful than view.width/height because
  // it handles resolution
}
resize();
$(document).keydown(function (event) {
    if (event.which == "17") {
        ctrlIsPressed = true;
    }
});
$(document).keyup(function (event) {
    if (event.which == "17") {
        ctrlIsPressed = false;
    }
});
$(label).keyup(function (event) {
    if (event.which == "13") {
        // enter was released
        labelGiven = true;
        current.graphics.labelText = $(label).val();
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 14,
            fill: ['#ffffff', '#00ff99'], // gradient
            stroke: '#4a1850',
            strokeThickness: 0.5,
            wordWrap: true,
            wordWrapWidth: 440,
        });
        const advancedText = new PIXI.Text(current.graphics.labelText, style);
        advancedText.x = current.graphics.rectangleTextStart.x;
        advancedText.y = current.graphics.rectangleTextStart.y;
        advancedText.resolution = 2.4;
        current.graphics.addChild(advancedText)
        $(label).val("");
        $(label).hide();
        canvas.focus();
    }
});
$(label).keyup(function (event) {
    if (event.which == "27") {
        // escape was released
        labelGiven = true;
        // this may or may not work
        current.graphics.parent.removeChild(current.graphics);
        $(label).val("");
        $(label).hide();
        canvas.focus();
    }
});
let mapContainer = new PIXI.Container();
let labelGiven = true;
let map;
console.log("Hello there! How are you doing pixi.js? This is a WI.");
// load the texture we need
app.loader.add('map', 'Map20200123.png').load((loader, resources) => {
    map = new PIXI.Sprite(resources.map.texture);

    map.x = app.renderer.width / 2;
    map.y = app.renderer.height / 2;

    // Rotate around the center
    map.anchor.x = 0.5;
    map.anchor.y = 0.5;

    map.interactive = true;
    map
        // events for drag start
        .on('mousedown', onDragStart)
        //.on('touchstart', onDragStart)
        // events for drag end
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        //.on('touchend', onDragEnd)
        //.on('touchendoutside', onDragEnd)
        // events for drag move
        .on('mousemove', onDragMove)
    //.on('touchmove', onDragMove);

    app.stage.addChild(map);
});
var data;
var parent;
var start = { mouse: { x: 0, y: 0 }, map: { x: 0, y: 0, width: 0, height: 0 }, difference: { x: 0, y: 0 } }
var dragging;
var current = {
    rectangle: null,
    graphics: null
}
function onDragStart(event) {
    console.log("Drag start");
    if (!(dragging || drawing)) {
        start.mouse.x = event.data.getLocalPosition(map).x;
        start.mouse.y = event.data.getLocalPosition(map).y;
        start.map.x = map.position.x;
        start.map.y = map.position.y;
        start.map.width = map.width;
        start.map.height = map.height;

        start.difference.x = start.map.x - start.mouse.x;
        start.difference.y = start.map.y - start.mouse.y;
        if (ctrlIsPressed) {
            //this.alpha = 0.5;
            data = event.data;
            dragging = true;

        } else if (labelGiven) {

            drawing = true;
        }
    }

}

function onDragEnd(event) {
    console.log("Drag end");
    //this.alpha = 1;
    if (drawing == true) {
        drawing = false;
        const graphics = new PIXI.Graphics();
        let strokeWidth = 2;
        graphics.lineStyle(strokeWidth, 0xFEEB77, 1);
        var currentMouse = {
            x: event.data.getLocalPosition(map).x,
            y: event.data.getLocalPosition(map).y
        }
        let width = -start.mouse.x + currentMouse.x
        let height = -start.mouse.y + currentMouse.y
        graphics.drawRect(start.mouse.x, start.mouse.y, width, height);
        labelGiven = false;
        graphics.rectangleCenter = {
            x: start.mouse.x + width / 2,
            y: start.mouse.y + height / 2
        };
        graphics.rectangleTextStart = {
            x: start.mouse.x + strokeWidth * 3,
            y: start.mouse.y + strokeWidth * 3
        }
        current.graphics = graphics;
        graphics.zIndex = 2;
        map.addChild(graphics);
        $(label).show();
        label.focus();
    } else {
        dragging = false;
    }

    // set the interaction data to null
    this.data = null;
}

function onDragMove(event) {
    if (dragging) {
        var newPosition = event.data.getLocalPosition(app.stage);
        map.position.x = newPosition.x - start.mouse.x;
        map.position.y = newPosition.y - start.mouse.y;
    }
}