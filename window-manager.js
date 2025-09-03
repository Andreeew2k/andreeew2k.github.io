// window-manager.js
document.addEventListener("DOMContentLoaded", () => {
  function bringToFront(win) {
    let maxZ = 100;
    document.querySelectorAll(".window").forEach(w => {
      const z = parseInt(window.getComputedStyle(w).zIndex) || 0;
      if (z > maxZ) maxZ = z;
    });
    win.style.zIndex = maxZ + 1;
  }

  window.bringToFront = bringToFront;

  document.addEventListener("mousedown", e => {
    const win = e.target.closest(".window");
    if (win) bringToFront(win);
  });

  // Selection box
  const selectionBox = document.getElementById("selection-box");
  let startX, startY, isSelecting = false;

  document.addEventListener("mousedown", e => {
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

  // Helper: detect mobile
  function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  // Handle link icons
  document.querySelectorAll('.icon[data-link]').forEach(icon => {
    const handler = () => {
      const url = icon.dataset.link;
      if (url) {
        if (window.SoundFX) {
          SoundFX.open();
          SoundFX.click();
        }
        window.open(url, "_blank");
      }
    };

    if (isMobile()) {
      icon.addEventListener("click", handler);
    } else {
      icon.addEventListener("dblclick", handler);
    }
  });
});
