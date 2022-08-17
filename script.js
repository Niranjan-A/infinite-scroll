// DOM Elements
const imageContainer = document.getElementById("images-container");
const loader = document.getElementById("loader");
const body = document.querySelector("body");

// Global Variables
let isReady = false;
let photosArray = [];
let totalImages = 0;
let loadedImages = 0;
let isInitialLoad = true;

// Unsplash API
let initialCount = 6;
const apiKey = "nXnn3KaJILUbTr5DcRlStwItxbFKhr7O6m2nZj5GL2g";
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}&query=dogs`;

// Updates the image count after initial load to improve performance
function updateAPIURLWithImageCount(count) {
  apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}&query=dogs`;
}

//Check if all images have loaded
function imagesLoaded() {
  loadedImages++;
  if (loadedImages === totalImages) {
    isReady = true;
    loader.hidden = true;
    imageContainer.hidden = false;
  }
}

// Helper function for setting attribute values to DOM elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Get photos using the Unsplash API
async function getPhotos() {
  try {
    loader.hidden = false;
    imageContainer.hidden = true;
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
    if (isInitialLoad) {
      isInitialLoad = false;
      updateAPIURLWithImageCount(30);
    }
  } catch (error) {
    console.log(error);
    const errorContainer = document.createElement("figure");
    const errorIllustration = document.createElement("img");
    setAttributes(errorIllustration, {
      src: "./images/error-illustration.svg",
      alt: "Error Illustration",
      title: "API Error",
    });
    const errorMsg = document.createElement("span");
    errorMsg.innerHTML =
      "API Call Rate Limit Exceeded. Try again after an hour!";
    errorContainer.appendChild(errorIllustration);
    errorContainer.appendChild(errorMsg);
    body.appendChild(errorContainer);
    loader.hidden = true;
  }
}

// Create elements for Links & Images and add them to DOM for displaying
function displayPhotos() {
  loadedImages = 0;
  totalImages = photosArray.length;
  photosArray.forEach((photo) => {
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.links.html,
      target: "_blank",
    });

    const image = document.createElement("img");
    setAttributes(image, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
    image.addEventListener("load", imagesLoaded);
    item.appendChild(image);
    imageContainer.appendChild(item);
  });
}

// On Load
getPhotos();

//Infinite Scroll functionality
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY > document.body.offsetHeight - 1000 &&
    isReady
  ) {
    isReady = false;
    getPhotos();
  }
});
