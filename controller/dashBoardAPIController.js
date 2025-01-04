let user_id = localStorage.getItem('user_id');
console.log("Retrieved user ID from localStorage color API: " + user_id);
const canvas = document.getElementById("imageCanvas");
const ctx = canvas.getContext("2d");
const imageUploader = document.getElementById("imageUploader");
const fullCmykDetails = document.getElementById("fullCmykDetails");
const selectedCmykDetails = document.getElementById("selectedCmykDetails");
const resolutionTag = document.querySelector("#cmykResults h2:nth-of-type(3)");
const defaultImage = new Image();
defaultImage.src = "https://i.ibb.co/zNqfPJ4/Untitled-1.jpg";

let isSelecting = false;
let selectionStart = { x: 0, y: 0 };
let selectionEnd = { x: 0, y: 0 };

let next_colour_id;
let color_ids;

let count = 0

initialize();

function initialize() {
    setTimeout(() => {
        loadColour()
        loadNextIid()
        loadData()
    }, 1000);
}

function loadColour() {
    $.ajax({
        url: `http://localhost:8080/cmyk/api/colour/user/${user_id}`,
        type: "GET",
        dataType: "json",
        success: (res) => {
            console.log("Response received:", res);

            let tableBody = $("#color-id");
            tableBody.html(''); // Clear existing rows

            const crops = Array.isArray(res) ? res : [res];

            crops.forEach((colour, index) => {
                let tableRow = `
                    <tr class="colour-row" data-index="${index}" data-colour='${JSON.stringify(colour)}'>
                        <td>${index + 1}</td>
                        <td><img src="data:image/jpeg;base64,${colour.image}" alt="Color Image" style="width: 100px; height: 100px;"></td>
                        <td>${colour.resolution}</td>
                        <td>${colour.color_C + "%"}</td>
                        <td>${colour.color_M + "%"}</td>
                        <td>${colour.color_Y + "%"}</td>
                        <td>${colour.color_K + "%"}</td>
                        <td>${"LKR " + colour.fullCost}</td>
                    </tr>
                `;
                tableBody.append(tableRow);
            });

            // Attach click event to rows
            $(".colour-row").on("click", function () {
                const colourData = $(this).data("colour");
                color_ids = colourData.id;

                // Populate modal with data
                $("#exampleModalCenter .promo-img").css("background-image", `url('data:image/jpeg;base64,${colourData.image}')`);
                $("#exampleModalCenter .content-text h3").text("Image Details");
                $("#exampleModalCenter .content-text h4").text(`ID: ${colourData.id}`);
                $("#exampleModalCenter .content-text").find("h5:contains('Cyan')").text(`Cyan: ${colourData.color_C}%`);
                $("#exampleModalCenter .content-text").find("h5:contains('Magenta')").text(`Magenta: ${colourData.color_M}%`);
                $("#exampleModalCenter .content-text").find("h5:contains('Yellow')").text(`Yellow: ${colourData.color_Y}%`);
                $("#exampleModalCenter .content-text").find("h5:contains('Black')").text(`Black: ${colourData.color_K}%`);

                $("#exampleModalCenter .content-text").find("h5:contains('resolution')").text(`Resolution: ${colourData.resolution}`);
                $("#exampleModalCenter .content-text").find("h5:contains('Cost')").text(`Full Cost: LKR ${colourData.fullCost}`);

                // Show the modal
                $("#exampleModalCenter").modal("show");
            });
        },
        error: (err) => {
            Swal.fire({
                position: "top",
                icon: "error",
                title: "NO Data Have!",
                text: "Please try again later.",
                showConfirmButton: true,
                timer: 4000
            });
            console.error("Failed to load colour:", err);
        }
    });
}

function loadNextIid() {


    $.ajax({
        url: "http://localhost:8080/cmyk/api/colour/genColourID",
        type: "GET",
        success: (res) => {

            console.log("print response nextID:" + res)
            next_colour_id = res
            localStorage.setItem('colour_id', next_colour_id);


        },
        error: (err) => {
            Swal.fire({
                position: "top",
                icon: "question",
                title: "Failed to load next Colour ID!..",
                showConfirmButton: false,
                timer: 3500
            });
            console.error("Failed to load next Colour ID:", err);
        }
    });
}

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

defaultImage.onload = () => {
    canvas.width = defaultImage.width;
    canvas.height = defaultImage.height;
    ctx.drawImage(defaultImage, 0, 0);
    resolutionTag.innerText = `Resolution: ${defaultImage.width} x ${defaultImage.height}`;
    calculateFullCmyk();
};

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
        resolutionTag.innerText = `Resolution: ${image.width} x ${image.height}`;
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

    if (width === 0 || height === 0) {

        Swal.fire({
            position: "top",
            icon: "question",
            title: "Please select a valid area!..",
            showConfirmButton: false,
            timer: 3500
        });
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

$(document).ready(function() {
    $(".btn-info").click(function() {
        const formData = new FormData();
        const canvas = document.getElementById("imageCanvas");
        const fileInput = document.getElementById("imageUploader");
        const file = fileInput.files[0];

        if (!file) {

            Swal.fire({
                position: "top",
                icon: "question",
                title: "Please upload an image first...!",
                showConfirmButton: false,
                timer: 3500
            });
            return;
        }

        const user_id = localStorage.getItem('user_id');
        const colour_id = localStorage.getItem('colour_id');

        const fullCmykText = fullCmykDetails.innerText.match(/\d+(\.\d+)?/g);
        const selectedCmykText = selectedCmykDetails.innerText.match(/\d+(\.\d+)?/g);

        formData.append("id", colour_id);
        formData.append("color_C", fullCmykText[0]);
        formData.append("color_M", fullCmykText[1]);
        formData.append("color_Y", fullCmykText[2]);
        formData.append("color_K", fullCmykText[3]);
        formData.append("image", file);
        formData.append("resolution", `${canvas.width}x${canvas.height}`);
        formData.append("userEntity", user_id);

        $.ajax({
            url: "http://localhost:8080/cmyk/api/colour",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                loadColour()
                loadNextIid()
                loadData()
                Swal.fire({
                    position: "top",
                    icon: "success",
                    title: "Image and data saved successfully!",
                    text: "You can now see the cost and other details in the tables.",
                    showConfirmButton: false,
                    timer: 3500
                });


            },
            error: function(error) {
                console.error("Error saving CMYK data:", error);
                Swal.fire({
                    position: "top",
                    icon: "question",
                    title: "Error saving Image and data:..",
                    showConfirmButton: false,
                    timer: 3500
                });

            }
        });
    });
});


function loadData() {
    $.ajax({
        url: `http://localhost:8080/cmyk/api/colour/statistics/${user_id}`, // Ensure `user_id` is defined
        type: "GET",
        dataType: "json",
        success: (res) => {
            console.log("Response received:", res);


            if (res.totalImageCount !== undefined) {
                $("#image").text(res.totalImageCount);
            }


            if (res.totalCost !== undefined) {
                $("#cost").text(res.totalCost.toFixed(2));
            }


            if (res.weeklyAverage !== undefined) {
                $("#week").text(`${(res.weeklyAverage * 100).toFixed(2)} %`);
            }

            // Update the Date
            const currentDate = new Date().toLocaleDateString("en-GB");
            $("#date").text(currentDate);
        },
        error: (err) => {
            Swal.fire({
                position: "top",
                icon: "error",
                title: "Failed to load colour!",
                text: "Please try again later.",
                showConfirmButton: true,
                timer: 4000
            });
            console.error("Failed to load colour:", err);
        }
    });
}

$("#delete-colour").on("click", function () {


    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {


            $.ajax({
                url: `http://localhost:8080/cmyk/api/colour/${color_ids}`,
                type: "DELETE",

                success: (res) => {
                    console.log("Response received:", res);
                    initialize()
                    $('#exampleModalCenter').modal('hide');
                    Swal.fire({
                        title: "Colour Delete successfully!",
                        text: "Success",
                        icon: "success"
                    });


                },
                error: (err) => {
                    console.error("AJAX error:", err);
                    Swal.fire({
                        title: "Can't access   data !",
                        text: "Error",
                        icon: "Error"
                    });
                }
            });
        }
    });




});


