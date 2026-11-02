// JavaScript source code
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const colorPicker = document.getElementById('colorPicker');
const thicknessSlider = document.getElementById('thickness');
const thicknessValue = document.getElementById('thicknessValue');

const brushBtn = document.getElementById('brushBtn');
const eraserBtn = document.getElementById('eraserBtn');
const rectBtn = document.getElementById('rectBtn');
const circleBtn = document.getElementById('circleBtn');
const toolButtons = document.querySelectorAll('.tool-btn');

const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');

let isDrawing = false;
let currentTool = 'brush'; // По умолчанию кисть
let startX = 0;
let startY = 0;
let savedImageData = null;

ctx.lineCap = 'round';
ctx.lineJoin = 'round';

colorPicker.addEventListener('input', (e) => {
    ctx.strokeStyle = e.target.value;
    ctx.fillStyle = e.target.value;
});

thicknessSlider.addEventListener('input', (e) => {
    ctx.lineWidth = e.target.value;
    thicknessValue.textContent = e.target.value;
});

ctx.lineWidth = thicknessSlider.value;

toolButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        toolButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentTool = btn.getAttribute('data-tool');

        if (currentTool === 'eraser') {
            canvas.style.cursor = 'cell';
        } else if (currentTool === 'brush') {
            canvas.style.cursor = 'crosshair';
        } else {
            canvas.style.cursor = 'crosshair';
        }
    });
});

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;

    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;

    if (currentTool === 'rect' || currentTool === 'circle') {
        savedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    } else {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    if (currentTool === 'brush') {
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
    }
    else if (currentTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
    }
    else if (currentTool === 'rect') {
        ctx.putImageData(savedImageData, 0, 0);

        ctx.beginPath();
        ctx.rect(startX, startY, currentX - startX, currentY - startY);
        ctx.stroke();
    }
    else if (currentTool === 'circle') {
        ctx.putImageData(savedImageData, 0, 0);
        const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));

        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        ctx.stroke();
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.beginPath();
});

canvas.addEventListener('mouseleave', () => {
    isDrawing = false;
    ctx.beginPath();
});
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

saveBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'my-drawing.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});