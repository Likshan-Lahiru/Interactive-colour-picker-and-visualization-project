function rgbToCmyk(r, g, b) {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    const c = (1 - rNorm - k) / (1 - k) || 0;
    const m = (1 - gNorm - k) / (1 - k) || 0;
    const y = (1 - bNorm - k) / (1 - k) || 0;

    return {
        c: c * 100,
        m: m * 100,
        y: y * 100,
        k: k * 100,
    };
}

const canvas = document.getElementById("imageCanvas");
const ctx = canvas.getContext("2d");
const imageUploader = document.getElementById("imageUploader");
const fullCmykDetails = document.getElementById("fullCmykDetails");
const selectedCmykDetails = document.getElementById("selectedCmykDetails");

let isSelecting = false;
let selectionStart = { x: 0, y: 0 };
let selectionEnd = { x: 0, y: 0 };

imageUploader.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const image = new Image();

    reader.onload = () => {
        image.src = reader.result;
    };

    image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        calculateFullCmyk();
    };

    reader.readAsDataURL(file);
});

canvas.addEventListener("mousedown", (event) => {
    isSelecting = true;
    const rect = canvas.getBoundingClientRect();
    selectionStart = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
});

canvas.addEventListener("mouseup", (event) => {
    isSelecting = false;
    const rect = canvas.getBoundingClientRect();
    selectionEnd = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };

    calculateSelectedCmyk();
});

function calculateFullCmyk() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let totalC = 0, totalM = 0, totalY = 0, totalK = 0;
    const totalPixels = imageData.length / 4;

    for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];

        const cmyk = rgbToCmyk(r, g, b);
        totalC += cmyk.c;
        totalM += cmyk.m;
        totalY += cmyk.y;
        totalK += cmyk.k;
    }

    const avgC = (totalC / totalPixels).toFixed(2);
    const avgM = (totalM / totalPixels).toFixed(2);
    const avgY = (totalY / totalPixels).toFixed(2);
    const avgK = (totalK / totalPixels).toFixed(2);

    fullCmykDetails.innerText = `C: ${avgC}%, M: ${avgM}%, Y: ${avgY}%, K: ${avgK}%`;
}

function calculateSelectedCmyk() {
    const startX = Math.min(selectionStart.x, selectionEnd.x);
    const startY = Math.min(selectionStart.y, selectionEnd.y);
    const width = Math.abs(selectionEnd.x - selectionStart.x);
    const height = Math.abs(selectionEnd.y - selectionStart.y);

    // Check if the selection area is valid
    if (width === 0 || height === 0) {
        alert("Please select a valid area!");
        return;
    }

    const imageData = ctx.getImageData(startX, startY, width, height).data;

    let totalC = 0, totalM = 0, totalY = 0, totalK = 0;
    const totalPixels = imageData.length / 4;

    for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];

        const cmyk = rgbToCmyk(r, g, b);
        totalC += cmyk.c;
        totalM += cmyk.m;
        totalY += cmyk.y;
        totalK += cmyk.k;
    }

    const avgC = (totalC / totalPixels).toFixed(2);
    const avgM = (totalM / totalPixels).toFixed(2);
    const avgY = (totalY / totalPixels).toFixed(2);
    const avgK = (totalK / totalPixels).toFixed(2);

    selectedCmykDetails.innerText = `C: ${avgC}%, M: ${avgM}%, Y: ${avgY}%, K: ${avgK}%`;
}
