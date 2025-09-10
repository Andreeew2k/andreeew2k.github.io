// js/apps/notepad.js
document.addEventListener("DOMContentLoaded", () => {
  // Ensure global namespace exists
  window.Apps = window.Apps || {};

  /**
   * Open a new Notepad window
   * @param {string} file - Path to the .txt file to load (default: readme.txt)
   */
  function openNotepad(file = "readme.txt") {
    const tpl = document.getElementById("notepad-template");
    if (!tpl) {
      console.error("❌ Notepad template missing");
      return;
    }

    // Clone window from template
    const win = tpl.content.firstElementChild.cloneNode(true);
    win.style.display = "block";

    // Desktop margins
    const margin = 20;

    // Default + max sizes (Notepad sits in the left half of screen)
    const defaultWidth = 650;
    const defaultHeight = 850;
    const maxWidth = window.innerWidth / 2 - margin * 2;
    const maxHeight = window.innerHeight - margin * 2;

    // Set constraints
    win.style.minWidth = "300px";   // readable minimum
    win.style.minHeight = "150px";  // must fit title bar
    win.style.maxWidth = maxWidth + "px";
    win.style.maxHeight = maxHeight + "px";

    // Apply initial size
    win.style.width = Math.min(defaultWidth, maxWidth) + "px";
    win.style.height = Math.min(defaultHeight, maxHeight) + "px";

    // Randomized safe spawn (only left side of screen)
    const safeLeft = Math.random() * (maxWidth - parseInt(win.style.width));
    const safeTop = Math.random() * (maxHeight - parseInt(win.style.height));
    win.style.left = safeLeft + margin + "px";
    win.style.top = safeTop + margin + "px";

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

          // Adjust minWidth based on longest line
          const longestLine = txt.split("\n").reduce((a, b) =>
            a.length > b.length ? a : b, ""
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
          win.style.minWidth = Math.min(lineWidth + lineMargin, maxWidth) + "px";
        })
        .catch(err => {
          console.error("❌ Could not load", file, err);
          pre.textContent = "Error loading file.";
        });
    }

    // Add window to DOM
    document.body.appendChild(win);

    // Enable dragging + z-index control
    makeDraggable(win);
    bringToFront(win);

    console.log("✅ Notepad opened:", file);
  }

  // Expose public API
  window.Apps.Notepad = { open: openNotepad };

  // Attach handlers to icons with data-file
  document.querySelectorAll('.icon[data-file]').forEach(icon => {
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
  openNotepad("readme.txt");
});
