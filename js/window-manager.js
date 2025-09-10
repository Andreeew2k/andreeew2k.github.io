// window-manager.js
document.addEventListener("DOMContentLoaded", () => {
  // ==============================
  // Z-INDEX MANAGEMENT
  // ==============================
  function bringToFront(win) {
    let maxZ = 100;
    document.querySelectorAll(".window").forEach(w => {
      const z = parseInt(window.getComputedStyle(w).zIndex) || 0;
      if (z > maxZ) maxZ = z;
    });
    win.style.zIndex = maxZ + 1;
  }
  window.bringToFront = bringToFront;

  // ==============================
  // DRAGGING SUPPORT
  // ==============================
  function makeDraggable(win) {
    const titleBar = win.querySelector(".title-bar");
    if (!titleBar) return;

    let isDragging = false, offsetX = 0, offsetY = 0;

    titleBar.addEventListener("mousedown", e => {
      isDragging = true;
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
      bringToFront(win);
    });

    document.addEventListener("mousemove", e => {
      if (!isDragging) return;
      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;

      // Clamp inside viewport
      newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - win.offsetWidth));
      newTop = Math.max(0, Math.min(newTop, window.innerHeight - win.offsetHeight));

      win.style.left = `${newLeft}px`;
      win.style.top = `${newTop}px`;
    });

    document.addEventListener("mouseup", () => isDragging = false);
  }
  window.makeDraggable = makeDraggable;

  // ==============================
  // MOBILE DETECTION
  // ==============================
  window.isMobile = () =>
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // ==============================
  // SELECTION BOX (drag-select on desktop)
  // ==============================
  const selectionBox = document.getElementById("selection-box");
  let startX, startY, isSelecting = false;

  document.addEventListener("mousedown", e => {
    // Only start selection if not clicking on icon or window
    if (!e.target.closest(".icon") && !e.target.closest(".window")) {
      isSelecting = true;
      startX = e.pageX;
      startY = e.pageY;
      selectionBox.style.left = `${startX}px`;
      selectionBox.style.top = `${startY}px`;
      selectionBox.style.width = "0px";
      selectionBox.style.height = "0px";
      selectionBox.style.display = "block";
    }
  });

  document.addEventListener("mousemove", e => {
    if (!isSelecting) return;
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
    }
  });

  // ==============================
  // ICON HANDLERS (for simple data-link icons)
  // ==============================
  document.querySelectorAll('.icon[data-link]').forEach(icon => {
    const handler = () => {
      const url = icon.dataset.link;
      if (url) {
        if (window.SoundFX) {
          SoundFX.open?.(); // optional "open" sound
          SoundFX.click();
        }
        window.open(url, "_blank");
      }
    };
    if (isMobile()) icon.addEventListener("click", handler);
    else icon.addEventListener("dblclick", handler);
  });
});
