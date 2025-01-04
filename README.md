# CMYK Color Analyzer

A web-based tool that enables users to upload an image, analyze its overall CMYK color ranges, and calculate CMYK values for selected areas. This tool leverages the HTML5 Canvas API for rendering and processing images and provides an interactive user interface for selecting areas and displaying results.

---

## Features
1. **Full Image Analysis**:
   - Automatically calculates the CMYK color range for the entire uploaded image.
   - Displays the breakdown of Cyan, Magenta, Yellow, and Key (Black) percentages for the image.

2. **Selected Area Analysis**:
   - Allows users to click and drag on the image to select a rectangular area.
   - Computes the CMYK color range for the selected section.

3. **Interactive Visualization**:
   - The uploaded image is displayed on an HTML5 canvas, allowing users to interact with it.
   - Selected regions are highlighted to indicate the analysis area.

4. **Color Models**:
   - Converts RGB values of the image to CMYK using standard conversion algorithms.
   - Displays detailed CMYK values in real-time.

---

## API Details
This project primarily uses the **Canvas API** for image processing and data extraction.

### **Canvas API Methods Used**
1. **`getContext('2d')`**:
   - Creates a 2D rendering context for the canvas element.
   - Used for drawing the image and extracting pixel data.

2. **`drawImage()`**:
   - Renders the uploaded image onto the canvas for further processing.
   - Syntax:
     ```javascript
     context.drawImage(image, x, y, width, height);
     ```

3. **`getImageData()`**:
   - Retrieves pixel data (RGBA values) from a specified rectangular area of the canvas.
   - Syntax:
     ```javascript
     context.getImageData(x, y, width, height);
     ```

4. **Mouse Events**:
   - Used for interactive area selection on the canvas (`mousedown`, `mousemove`, `mouseup`).

5. **RGB to CMYK Conversion Formula**:
   - The project includes a custom function to convert RGB values to CMYK:
     ```javascript
     function rgbToCmyk(r, g, b) {
         const c = 1 - (r / 255);
         const m = 1 - (g / 255);
         const y = 1 - (b / 255);
         const k = Math.min(c, m, y);
         return {
             c: (c - k) / (1 - k) || 0,
             m: (m - k) / (1 - k) || 0,
             y: (y - k) / (1 - k) || 0,
             k: k
         };
     }
     ```

---

## Installation and Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/cmyk-color-analyzer.git
