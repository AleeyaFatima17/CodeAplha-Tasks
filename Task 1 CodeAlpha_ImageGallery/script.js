// ========================================
// CODEALPHA IMAGE GALLERY - JAVASCRIPT
// ========================================


// Get all gallery images
const images = document.querySelectorAll(".gallery img");

// Get filter buttons
const filterButtons = document.querySelectorAll(".filter");

// Get lightbox elements
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");

const closeButton = document.getElementById("close");
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");


// Current image
let currentIndex = 0;


// ========================================
// IMAGE FILTER
// ========================================

filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        // Get selected category
        const selectedCategory = this.getAttribute("data-category");

        // Remove active class from all buttons
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        // Add active class to clicked button
        this.classList.add("active");


        // Show / hide images
        images.forEach(image => {

            const imageCategory = image.getAttribute("data-category");

            if (
                selectedCategory === "all" ||
                imageCategory === selectedCategory
            ) {

                image.style.display = "block";

            } else {

                image.style.display = "none";

            }

        });

    });

});


// ========================================
// OPEN LIGHTBOX
// ========================================

images.forEach((image, index) => {

    image.addEventListener("click", function () {

        currentIndex = index;

        lightboxImage.src = this.src;

        lightbox.style.display = "flex";

    });

});


// ========================================
// NEXT IMAGE
// ========================================

nextButton.addEventListener("click", function () {

    currentIndex++;

    // If we reach the last image,
    // go back to the first image
    if (currentIndex >= images.length) {

        currentIndex = 0;

    }

    lightboxImage.src = images[currentIndex].src;

});


// ========================================
// PREVIOUS IMAGE
// ========================================

prevButton.addEventListener("click", function () {

    currentIndex--;

    // If we go before the first image,
    // go to the last image
    if (currentIndex < 0) {

        currentIndex = images.length - 1;

    }

    lightboxImage.src = images[currentIndex].src;

});


// ========================================
// CLOSE LIGHTBOX
// ========================================

closeButton.addEventListener("click", function () {

    lightbox.style.display = "none";

});


// ========================================
// CLOSE LIGHTBOX BY CLICKING OUTSIDE
// ========================================

lightbox.addEventListener("click", function (event) {

    if (event.target === lightbox) {

        lightbox.style.display = "none";

    }

});


// ========================================
// KEYBOARD CONTROLS
// ========================================

document.addEventListener("keydown", function (event) {

    // Only work when lightbox is open
    if (lightbox.style.display === "flex") {

        // Right Arrow = Next
        if (event.key === "ArrowRight") {

            nextButton.click();

        }

        // Left Arrow = Previous
        if (event.key === "ArrowLeft") {

            prevButton.click();

        }

        // Escape = Close
        if (event.key === "Escape") {

            closeButton.click();

        }

    }

});