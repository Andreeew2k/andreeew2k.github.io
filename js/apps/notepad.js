// js/apps/notepad.js
document.addEventListener("DOMContentLoaded", () => {
  window.Apps = window.Apps || {};

  // Detect mobile reliably
  function isMobile() {
    return (
      /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      window.innerWidth <= 1024 // ✅ wider breakpoint for tablets
    );
  }

  function openNotepad(file = "readme_mobile.txt") {
    const tpl = document.getElementById("notepad-template");
    if (!tpl) {
      console.error("❌ Notepad template missing");
      return;
    }

    const win = tpl.content.firstElementChild.cloneNode(true);
    win.style.display = "block";

    if (isMobile()) {
      // === Mobile → force fullscreen ===
      Object.assign(win.style, {
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        width: "100%",
        height: "100%",
        margin: "0",
        border: "none",
        borderRadius: "0",
        zIndex: "9999",
        display: "flex",
        flexDirection: "column"
      });
    } else {
      // === Desktop sizing logic ===
      const margin = 20;
      const defaultWidth = 650;
      const defaultHeight = 850;
      const maxWidth = window.innerWidth / 2 - margin * 2;
      const maxHeight = window.innerHeight - margin * 2;

      win.style.minWidth = "300px";
      win.style.minHeight = "150px";
      win.style.maxWidth = maxWidth + "px";
      win.style.maxHeight = maxHeight + "px";

      win.style.width = Math.min(defaultWidth, maxWidth) + "px";
      win.style.height = Math.min(defaultHeight, maxHeight) + "px";

      const safeLeft = Math.random() * (maxWidth - parseInt(win.style.width));
      const safeTop = Math.random() * (maxHeight - parseInt(win.style.height));
      win.style.left = safeLeft + margin + "px";
      win.style.top = safeTop + margin + "px";
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

          if (!isMobile()) {
            // Adjust desktop width to longest line
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

    document.body.appendChild(win);

    // Desktop only: enable dragging
    if (!isMobile()) {
      if (typeof makeDraggable === "function") makeDraggable(win);
      if (typeof bringToFront === "function") bringToFront(win);
    }

    console.log("✅ Notepad opened:", file);
  }

  window.Apps.Notepad = { open: openNotepad };

  // Attach to icons
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
    if (isMobile()) icon.addEventListener("click", handler);
    else icon.addEventListener("dblclick", handler);
  });

  // Auto-open README
  openNotepad("readme_mobile.txt");
});
