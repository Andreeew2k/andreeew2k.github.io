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

// Dragging
let isDragging = false, offsetX = 0, offsetY = 0;
titleBar.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - windowEl.offsetLeft;
  offsetY = e.clientY - windowEl.offsetTop;
});
document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    // clamp to window bounds
    const maxLeft = window.innerWidth - windowEl.offsetWidth;
    const maxTop = window.innerHeight - windowEl.offsetHeight;

    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    windowEl.style.left = newLeft + 'px';
    windowEl.style.top = newTop + 'px';
  }
});

document.addEventListener('mouseup', () => isDragging = false);

// Auto-open README on page load
window.addEventListener("load", () => {
  const firstFile = "readme.txt"; // adjust if different
  windowTitle.textContent = `${firstFile} - Notepad`;
  contentEl.textContent = "Loading...";

  fetch(firstFile)
    .then(res => res.text())
    .then(text => contentEl.textContent = text)
    .catch(() => contentEl.textContent = "Error loading file.");

  windowEl.style.display = "block";
});
