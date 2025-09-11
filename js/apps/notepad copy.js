// js/apps/notepad.js
document.addEventListener("DOMContentLoaded", () => {
  function openNotepad(file = "readme_mobile.txt") {
    const tpl = document.getElementById("notepad-template");
    if (!tpl) return console.error("❌ Notepad template missing");

    // Clone the template
    const win = tpl.content.firstElementChild.cloneNode(true);

    // 🚀 Always fullscreen
    win.style.position = "fixed";
    win.style.inset = "0";        // top:0; right:0; bottom:0; left:0
    win.style.width = "100%";
    win.style.height = "100%";
    win.style.margin = "0";
    win.style.border = "none";
    win.style.borderRadius = "0";
    win.style.display = "flex";
    win.style.flexDirection = "column";
    win.style.zIndex = "9999";

    // Close button
    win.querySelector(".close-btn").addEventListener("click", () => win.remove());

    // Load file content
    const pre = win.querySelector("pre");
    pre.textContent = "Loading...";
    if (file) {
      fetch(file)
        .then(res => res.ok ? res.text() : Promise.reject(res.status))
        .then(txt => (pre.textContent = txt))
        .catch(err => {
          console.error("❌ Could not load", file, err);
          pre.textContent = "Error loading file.";
        });
    }

    document.body.appendChild(win);
  }

  // Expose globally
  window.Apps = window.Apps || {};
  window.Apps.Notepad = { open: openNotepad };

  // Attach to icons
  document.querySelectorAll(".icon[data-file]").forEach(icon => {
    icon.addEventListener("click", () => {
      const file = icon.dataset.file;
      if (file?.endsWith(".txt")) openNotepad(file);
    });
  });

  // Auto-open README on startup
  openNotepad("readme_mobile.txt");
});
