const icons = document.querySelectorAll('.icon[data-file]');
const windowEl = document.getElementById('readme-window');
const titleBar = document.getElementById('title-bar');
const windowTitle = document.getElementById('window-title');
const contentEl = document.getElementById('readme-text');
const closeBtn = document.getElementById('close-btn');

// Open Notepad when icon clicked
icons.forEach(icon => {
  icon.addEventListener('dblclick', () => {
    const file = icon.getAttribute('data-file');
    windowTitle.textContent = `${file} - Notepad`;
    contentEl.textContent = "Loading...";

    // Fetch file content
    fetch(file)
      .then(res => res.text())
      .then(text => contentEl.textContent = text)
      .catch(() => contentEl.textContent = "Error loading file.");

    windowEl.style.display = 'block';
  });
});

// Close button
closeBtn.addEventListener('click', () => {
  windowEl.style.display = 'none';
});

// Dragging support
let isDragging = false, offsetX = 0, offsetY = 0;
titleBar.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - windowEl.offsetLeft;
  offsetY = e.clientY - windowEl.offsetTop;
});
document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    windowEl.style.left = (e.clientX - offsetX) + 'px';
    windowEl.style.top = (e.clientY - offsetY) + 'px';
  }
});
document.addEventListener('mouseup', () => isDragging = false);

// Startup fade
window.addEventListener("load", () => {
  const startup = document.getElementById("startup");
  const sound = document.getElementById("startup-sound");
  sound.play().catch(()=>{});
  setTimeout(() => {
    startup.classList.add("fade-out");
    setTimeout(() => startup.remove(), 1000);
  }, 4000);
});
// Image viewer logic
const imgIcon = document.getElementById('images-icon');
const imgWindow = document.getElementById('image-window');
const imgClose = document.getElementById('image-close');
const imgTitleBar = document.getElementById('image-titlebar');

imgIcon.addEventListener('dblclick', () => {
  imgWindow.style.display = 'block';
});

imgClose.addEventListener('click', () => {
  imgWindow.style.display = 'none';
});

// Dragging for image window
let isDraggingImg = false, offsetXImg = 0, offsetYImg = 0;
imgTitleBar.addEventListener('mousedown', (e) => {
  isDraggingImg = true;
  offsetXImg = e.clientX - imgWindow.offsetLeft;
  offsetYImg = e.clientY - imgWindow.offsetTop;
});
document.addEventListener('mousemove', (e) => {
  if (isDraggingImg) {
    imgWindow.style.left = (e.clientX - offsetXImg) + 'px';
    imgWindow.style.top = (e.clientY - offsetYImg) + 'px';
  }
});
document.addEventListener('mouseup', () => isDraggingImg = false);
