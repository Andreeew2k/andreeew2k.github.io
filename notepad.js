// notepad.js
document.addEventListener("DOMContentLoaded", () => {
  const tpl = document.getElementById("notepad-template");

  function makeDraggable(win) {
    const titleBar = win.querySelector(".title-bar");
    let isDragging = false, offsetX = 0, offsetY = 0;

    titleBar.addEventListener("mousedown", e => {
      isDragging = true;
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
      if (window.bringToFront) window.bringToFront(win);
    });

    document.addEventListener("mousemove", e => {
      if (!isDragging) return;
      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;
      newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - win.offsetWidth));
      newTop = Math.max(0, Math.min(newTop, window.innerHeight - win.offsetHeight));
      win.style.left = `${newLeft}px`;
      win.style.top = `${newTop}px`;
    });

    document.addEventListener("mouseup", () => isDragging = false);
  }

  function openNotepad(file) {
    const win = tpl.content.firstElementChild.cloneNode(true);
    win.style.display = "block";
    win.style.top = Math.random() * 200 + "px";
    win.style.left = Math.random() * 200 + "px";

    win.querySelector(".close-btn").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.close();
      win.remove();
    });

    const pre = win.querySelector("pre");
    pre.textContent = "Loading...";
    fetch(file)
      .then(res => res.text())
      .then(txt => pre.textContent = txt)
      .catch(() => pre.textContent = "Error loading file.");

    makeDraggable(win);
    document.body.appendChild(win);
    if (window.bringToFront) window.bringToFront(win);
  }

  // Helper: detect mobile
  function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  // Attach handlers to icons
  document.querySelectorAll('.icon[data-file]').forEach(icon => {
    const handler = () => {
      const file = icon.dataset.file;
      if (file && file.endsWith(".txt")) {
        if (window.SoundFX) {
          SoundFX.open();
          SoundFX.click();
        }
        openNotepad(file);
      }
    };

    if (isMobile()) {
      icon.addEventListener("click", handler);   // one tap on mobile
    } else {
      icon.addEventListener("dblclick", handler); // double click on desktop
    }
  });

  // Auto-open README.txt on startup
  openNotepad("readme.txt");
});
