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

    const margin = 20;

    // --- ✅ default safe sizing ---
    const defaultWidth = 650;
    const defaultHeight = 850;
    const maxWidth = window.innerWidth / 2 - margin * 2;  // only left half
    const maxHeight = window.innerHeight - margin * 2;

    // --- ✅ set min/max constraints ---
    const minWidth = 300;   // enough for text to fit comfortably
    const minHeight = 150;  // enough to always show title bar

    win.style.minWidth = minWidth + "px";
    win.style.minHeight = minHeight + "px";
    win.style.maxWidth = maxWidth + "px";
    win.style.maxHeight = maxHeight + "px";

    // --- ✅ apply initial size ---
    win.style.width = Math.min(defaultWidth, maxWidth) + "px";
    win.style.height = Math.min(defaultHeight, maxHeight) + "px";

    // --- ✅ spawn position (only left side of screen) ---
    const safeLeft = Math.random() * (maxWidth - parseInt(win.style.width));
    const safeTop = Math.random() * (maxHeight - parseInt(win.style.height));
    win.style.left = safeLeft + margin + "px";
    win.style.top = safeTop + margin + "px";

    // close button
    win.querySelector(".close-btn").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.close();
      win.remove();
    });

    // load file
    const pre = win.querySelector("pre");
    pre.textContent = "Loading...";
    fetch(file)
      .then(res => res.text())
      .then(txt => {
        pre.textContent = txt;

        // ✅ measure longest line width in pixels
        const lines = txt.split("\n");
        const longestLine = lines.reduce((a, b) => a.length > b.length ? a : b, "");

        const tempSpan = document.createElement("span");
        tempSpan.style.visibility = "hidden";
        tempSpan.style.position = "absolute";
        tempSpan.style.whiteSpace = "pre";
        tempSpan.style.fontFamily = getComputedStyle(pre).fontFamily;
        tempSpan.style.fontSize = getComputedStyle(pre).fontSize;
        tempSpan.textContent = longestLine;

        document.body.appendChild(tempSpan);
        const lineWidth = tempSpan.getBoundingClientRect().width;
        tempSpan.remove();

        // ✅ apply as minWidth, with margin
        const margin = 40;
        win.style.minWidth = Math.min(lineWidth + margin, window.innerWidth / 2 - 20) + "px";
      })
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
