// js/apps/notepad.js
document.addEventListener("DOMContentLoaded", () => {
  // Ensure global namespace exists
  window.Apps = window.Apps || {};

  function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  /**
   * Open a new Notepad window
   * @param {string} file - Path to the .txt file to load (default: readme.txt)
   */
  function openNotepad(file = "readme_mobile.txt") {
    const tpl = document.getElementById("notepad-template");
    if (!tpl) {
      console.error("❌ Notepad template missing");
      return;
    }

    // Clone window from template
    const win = tpl.content.firstElementChild.cloneNode(true);
    win.style.display = "block";

    // === Desktop sizing logic only ===
    if (!isMobile()) {
      const margin = 20;
      const defaultWidth = 650;
      const defaultHeight = 850;
      const maxWidth = window.innerWidth / 2 - margin * 2;
      const maxHeight = window.innerHeight - margin * 2;

      // Constraints
      win.style.minWidth = "300px";
      win.style.minHeight = "150px";
      win.style.maxWidth = maxWidth + "px";
      win.style.maxHeight = maxHeight + "px";

      // Initial size
      win.style.width = Math.min(defaultWidth, maxWidth) + "px";
      win.style.height = Math.min(defaultHeight, maxHeight) + "px";

      // Randomized safe spawn (desktop only → left half)
      const safeLeft = Math.random() * (maxWidth - parseInt(win.style.width));
      const safeTop = Math.random() * (maxHeight - parseInt(win.style.height));
      win.style.left = safeLeft + margin + "px";
      win.style.top = safeTop + margin + "px";
    } else {
      // === Mobile → let CSS handle fullscreen ===
      win.style.position = "fixed";
      win.style.top = "0";
      win.style.left = "0";
      win.style.right = "0";
      win.style.bottom = "0";
      // CSS (responsive.css) forces 100dvw/100dvh
    }

    // Close button
    win.querySelector(".close-btn").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.close?.();
      win.remove();
    });

    // Load file content
    const pre = win.querySelector("pre");
    pre.textContent = "Loading...";
    if (file) {
      fetch(file)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.text();
        })
        .then(txt => {
          pre.textContent = txt;

          // Adjust minWidth based on longest line (desktop only)
          if (!isMobile()) {
            const longestLine = txt.split("\n").reduce((a, b) =>
              a.length > b.length ? a : b,
              ""
            );

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

            const lineMargin = 40;
            win.style.minWidth =
              Math.min(lineWidth + lineMargin, parseInt(win.style.maxWidth)) +
              "px";
          }
        })
        .catch(err => {
          console.error("❌ Could not load", file, err);
          pre.textContent = "Error loading file.";
        });
    }

    // Add window to DOM
    document.body.appendChild(win);

    // Enable dragging + z-index (desktop only)
    if (!isMobile()) {
      if (typeof makeDraggable === "function") makeDraggable(win);
      if (typeof bringToFront === "function") bringToFront(win);
    }

    console.log("✅ Notepad opened:", file);
  }

  // Expose public API
  window.Apps.Notepad = { open: openNotepad };

  // Attach handlers to icons with data-file
  document.querySelectorAll(".icon[data-file]").forEach(icon => {
    const handler = () => {
      const file = icon.dataset.file;
      if (file?.endsWith(".txt")) {
        if (window.SoundFX) {
          SoundFX.open?.();
          SoundFX.click();
        }
        openNotepad(file);
      }
    };

    if (isMobile()) {
      icon.addEventListener("click", handler);
    } else {
      icon.addEventListener("dblclick", handler);
    }
  });

  // Auto-open README.txt on startup
  openNotepad("readme_mobile.txt");
});
