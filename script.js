const canvas = document.getElementById("main");
const ctx = canvas.getContext("2d");

ctx.lineJoin = "round";
ctx.lineCap = "round";
ctx.miterLimit = 1;

let strokes = [];
let undoneStrokes = [];
let currentStroke = null;

let currentColour = "#000000";
let currentSize = 2;

let drawing = false;
let lastX, lastY;

const colourPicker = document.getElementById("colourPicker");
colourPicker.addEventListener("input", (e) => {
    currentColour = e.target.value;
});

const sizePicker = document.getElementById("sizePicker");
sizePicker.addEventListener("input", (e) => {
    currentSize = Number(e.target.value);
});


function resizeCanvas() {

    // get window ratio, current size, and scale accordingly
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// when the drawing begins, start a new stroke
canvas.addEventListener("mousedown", (e) => {
    drawing = true;

    currentStroke = {
        colour: currentColour,
        size: currentSize,
        points: [{ x: e.offsetX, y: e.offsetY }]
    };

    lastX = e.offsetX;
    lastY = e.offsetY;
});

// as the moouse moves, draw the line
canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;

    const x = e.offsetX;
    const y = e.offsetY;

    currentStroke.points.push({ x, y });
    ctx.strokeStyle = currentStroke.colour;
    ctx.lineWidth = currentStroke.size;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX = x;
    lastY = y;
});

// when the mouse is released, save stroke and stop drawing
canvas.addEventListener("mouseup", () => {
    if (currentStroke != null) {
        strokes.push(currentStroke);
        // clear the redo history, as new stroke invalidates it
        undoneStrokes = [];
    }
    drawing = false;
    currentStroke = null;
});

canvas.addEventListener("mouseleave", () => {
    if (currentStroke != null) {
        strokes.push(currentStroke);
        undoneStrokes = [];
        currentStroke = null;
    }
    drawing = false;
});

// redraw all strokes from the strokes array
// used after undo/redo actions
function redrawCanvas() {
    const dpr = window.devicePixelRatio || 1;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    for (const stroke of strokes) {
        drawStroke(stroke);
    }
}

// to draw all stored strokes from data, not mouse events
function drawStroke(stroke) {
    ctx.strokeStyle = stroke.colour;
    ctx.lineWidth = stroke.size;

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.miterLimit = 1;

    ctx.beginPath();

    const points = stroke.points;
    // no strokes
    if (points.length === 0) return;

    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.stroke();
}

document.getElementById("undoButton").addEventListener("click", () => {
    if (strokes.length === 0)
        return;

    // pop and store the last stroke, then redraw everything
    const undoneStroke = strokes.pop();
    undoneStrokes.push(undoneStroke);

    redrawCanvas();
});

document.getElementById("redoButton").addEventListener("click", () => {
    if (undoneStrokes.length === 0)
        return;

    // move last stroke to strokes, then redraw everything
    const stroke = undoneStrokes.pop();
    strokes.push(stroke);

    redrawCanvas();
});
