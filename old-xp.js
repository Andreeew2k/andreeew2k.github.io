document.addEventListener("DOMContentLoaded", () => {
  // ------------------------
  // Utility: bring window to front
  // ------------------------
  function bringToFront(win) {
    let maxZ = 100;
    document.querySelectorAll('.window').forEach(w => {
      const z = parseInt(window.getComputedStyle(w).zIndex) || 0;
      if (z > maxZ) maxZ = z;
    });
    win.style.zIndex = maxZ + 1;
  }

  // ------------------------
  // Utility: make window draggable
  // ------------------------
  function makeDraggable(win) {
    const titleBar = win.querySelector('.title-bar');
    let isDragging = false, offsetX = 0, offsetY = 0;

    titleBar.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
      bringToFront(win);
    });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    // clamp to viewport
    const maxLeft = window.innerWidth - win.offsetWidth;
    const maxTop = window.innerHeight - win.offsetHeight;

    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    win.style.left = newLeft + "px";
    win.style.top = newTop + "px";
  });

    document.addEventListener('mouseup', () => isDragging = false);
  }

  // ------------------------
  // Notepad: open new instance
  // ------------------------
  function openNotepad(file) {
    const tpl = document.getElementById("notepad-template");
    const win = tpl.content.firstElementChild.cloneNode(true);
    win.style.display = "block";
    win.style.top = Math.random() * 200 + "px";
    win.style.left = Math.random() * 200 + "px";

    // Close button
    win.querySelector(".close-btn").addEventListener("click", () => win.remove());
    SoundFX.close();


    // Load file content
    const contentEl = win.querySelector(".notepad-content pre");
    contentEl.textContent = "Loading...";
    fetch(file)
      .then(res => res.text())
      .then(text => contentEl.textContent = text)
      .catch(() => contentEl.textContent = "Error loading file.");

    makeDraggable(win);
    bringToFront(win);
    document.body.appendChild(win);
      // Auto-open README.txt on startup
  }

  // ------------------------
  // Image Viewer: open new instance
  // ------------------------
  function openImageViewer(images = []) {
    const tpl = document.getElementById("imageviewer-template");
    const win = tpl.content.firstElementChild.cloneNode(true);
    win.style.display = "block";
    win.style.top = Math.random() * 200 + "px";
    win.style.left = Math.random() * 200 + "px";

    // State
    let currentIndex = 0, rotation = 0, zoom = 1, slideshowInterval = null;
    const imgEl = win.querySelector("img");
    const titleSpan = win.querySelector(".window-title");

    function showImage(index) {
      if (!images.length) return;
      imgEl.src = images[index];
      const name = images[index].split('/').pop();
      titleSpan.textContent = `${name} - Windows Picture and Fax Viewer`;
      imgEl.style.transform = `rotate(${rotation}deg) scale(${zoom})`;
    }

    // Close
    win.querySelector(".close-btn").addEventListener("click", () => {
      SoundFX.close();
      if (slideshowInterval) clearInterval(slideshowInterval);
      win.remove();
    });

    // Toolbar buttons
    win.querySelector(".prev-btn").addEventListener("click", () => {
      SoundFX.click();
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      rotation = 0; zoom = 1;
      showImage(currentIndex);
    });
    win.querySelector(".next-btn").addEventListener("click", () => {
      SoundFX.click();
      currentIndex = (currentIndex + 1) % images.length;
      rotation = 0; zoom = 1;
      showImage(currentIndex);
    });
    win.querySelector(".rotate-left").addEventListener("click", () => {
      SoundFX.click();
      rotation -= 90; showImage(currentIndex);
    });
    win.querySelector(".rotate-right").addEventListener("click", () => {
      SoundFX.click();
      rotation += 90; showImage(currentIndex);
    });
    win.querySelector(".zoom-in").addEventListener("click", () => {
      SoundFX.click();
      zoom += 0.1; showImage(currentIndex);
    });
    win.querySelector(".zoom-out").addEventListener("click", () => {
      SoundFX.click();
      zoom = Math.max(0.1, zoom - 0.1); showImage(currentIndex);
    });
    win.querySelector(".slideshow").addEventListener("click", () => {
      SoundFX.click();

      if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
      } else {
        slideshowInterval = setInterval(() => {
          currentIndex = (currentIndex + 1) % images.length;
          rotation = 0; zoom = 1;
          showImage(currentIndex);
        }, 3000);
      }
    });

    // Init
    if (images.length) showImage(currentIndex);

    makeDraggable(win);
    bringToFront(win);
    document.body.appendChild(win);
  }

  // ------------------------
  // Desktop icons double-click
  // ------------------------
  document.querySelectorAll('.icon').forEach(icon => {
    icon.addEventListener('dblclick', () => {
      SoundFX.open(); 
      const file = icon.dataset.file;
      const link = icon.dataset.link;

      if (file === "readme.txt") {
        openNotepad(file);
      }
      if (icon.id === "images-icon") {
        // Example: load images.json for viewer
        fetch("images.json")
          .then(res => res.json())
          .then(data => {
            const shuffled = data.sort(() => Math.random() - 0.5);
            openImageViewer(shuffled);
          });
      }
      if (link) {
        window.open(link, "_blank");
      }
    });
  });

  // ------------------------
  // Click inside window = bring to front
  // ------------------------
  document.addEventListener('mousedown', (e) => {
    const win = e.target.closest('.window');
    if (win) bringToFront(win);
  });
});

openNotepad("readme.txt");

document.addEventListener("DOMContentLoaded", () => {
  const desktop = document.getElementById("desktop");
  const selectionBox = document.getElementById("selection-box");

  let startX, startY, isSelecting = false;

  document.addEventListener("mousedown", (e) => {
    // Only start if not clicking an icon or window
    if (!e.target.closest('.icon') && !e.target.closest('.window')) {
      isSelecting = true;
      startX = e.pageX;
      startY = e.pageY;
      selectionBox.style.left = `${startX}px`;
      selectionBox.style.top = `${startY}px`;
      selectionBox.style.width = `0px`;
      selectionBox.style.height = `0px`;
      selectionBox.style.display = "block";
    }
  });

  document.addEventListener("mousemove", (e) => {
    if (!isSelecting) return;

    // clamp to viewport
    const mouseX = Math.max(0, Math.min(e.pageX, window.innerWidth));
    const mouseY = Math.max(0, Math.min(e.pageY, window.innerHeight));

    const x = Math.min(mouseX, startX);
    const y = Math.min(mouseY, startY);
    const w = Math.abs(mouseX - startX);
    const h = Math.abs(mouseY - startY);

    selectionBox.style.left = `${x}px`;
    selectionBox.style.top = `${y}px`;
    selectionBox.style.width = `${w}px`;
    selectionBox.style.height = `${h}px`;
  });


  document.addEventListener("mouseup", () => {
    if (isSelecting) {
      isSelecting = false;
      selectionBox.style.display = "none";
      selectionBox.style.width = `0px`;
      selectionBox.style.height = `0px`;
    }
  });
});
document.addEventListener("contextmenu", (e) => {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
  }
});

