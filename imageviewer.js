const imgIcon = document.getElementById('images-icon');
const imgWindow = document.getElementById('image-window');
const imgClose = document.getElementById('image-close');
const imgTitleBar = document.getElementById('image-titlebar');
const viewerImg = document.getElementById('viewer-img');
const imageTitle = document.getElementById('image-title');
const imageContent = document.querySelector('.image-content');

let images = [];

fetch("images.json")
  .then(res => res.json())
  .then(data => {
    // shuffle for random order
    images = data.sort(() => Math.random() - 0.5);
    showImage(0); // load the first one
  });

let currentIndex = 0;
let rotation = 0;
let zoom = 1;
let slideshowInterval = null;

// Show current image
function showImage(index) {
  if (!images.length) return;
  viewerImg.src = images[index];
  const name = images[index].split('/').pop();
  imageTitle.textContent = `${name} - Picture and Fax Viewer`;
  viewerImg.style.transform = `rotate(${rotation}deg) scale(${zoom})`;

  // toggle scrollbars only if zoom > 1
  if (zoom > 1) {
    imageContent.style.overflow = "auto";
  } else {
    imageContent.style.overflow = "hidden";
  }
}

// Open viewer
imgIcon.addEventListener('dblclick', () => {
  imgWindow.style.display = 'block';
  currentIndex = 0;
  rotation = 0;
  zoom = 1;
  showImage(currentIndex);
});

// Close
imgClose.addEventListener('click', () => {
  imgWindow.style.display = 'none';
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
  }
});

// Buttons
document.getElementById('prev-btn').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  rotation = 0; zoom = 1;
  showImage(currentIndex);
});

document.getElementById('next-btn').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % images.length;
  rotation = 0; zoom = 1;
  showImage(currentIndex);
});

document.getElementById('rotate-left').addEventListener('click', () => {
  rotation -= 90;
  showImage(currentIndex);
});

document.getElementById('rotate-right').addEventListener('click', () => {
  rotation += 90;
  showImage(currentIndex);
});

document.getElementById('zoom-in').addEventListener('click', () => {
  zoom += 0.1;
  showImage(currentIndex);
});

document.getElementById('zoom-out').addEventListener('click', () => {
  zoom = Math.max(0.1, zoom - 0.1);
  showImage(currentIndex);
});

document.getElementById('slideshow').addEventListener('click', () => {
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
  } else {
    slideshowInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      rotation = 0; zoom = 1;
      showImage(currentIndex);
    }, 5000);
  }
});

// Dragging
let isDraggingImg = false, offsetXImg = 0, offsetYImg = 0;
imgTitleBar.addEventListener('mousedown', (e) => {
  isDraggingImg = true;
  offsetXImg = e.clientX - imgWindow.offsetLeft;
  offsetYImg = e.clientY - imgWindow.offsetTop;
});
document.addEventListener('mousemove', (e) => {
  if (isDraggingImg) {
    let newLeft = e.clientX - offsetXImg;
    let newTop = e.clientY - offsetYImg;

    const maxLeft = window.innerWidth - imgWindow.offsetWidth;
    const maxTop = window.innerHeight - imgWindow.offsetHeight;

    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    imgWindow.style.left = newLeft + 'px';
    imgWindow.style.top = newTop + 'px';
  }
});
document.addEventListener('mouseup', () => isDraggingImg = false);

