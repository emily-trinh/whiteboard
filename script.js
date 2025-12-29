const canvas = document.getElementById("main");
const ctx = canvas.getContext("2d");

let currentColour = "#000000";
let currentSize = 2;
let currentStroke = null;

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
        points: [{ x: e.offsetX, y: e.offsetY}]
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

// when the mouse is released, stop drawing
canvas.addEventListener("mouseup", () => {
    drawing = false;
    currentStroke = null;
});
canvas.addEventListener("mouseleave", () => drawing = false);