document.addEventListener("DOMContentLoaded", () => {
  const exeIcon = document.getElementById("exe-icon");
  const exeTemplate = document.getElementById("exe-template");

  exeIcon.addEventListener("click", () => {
    let existing = document.querySelector(".exe-window");
    if (existing) {
      existing.style.display = "block";
      return;
    }

    const win = exeTemplate.content.cloneNode(true);
    document.body.appendChild(win);

    const windowEl = document.querySelector(".exe-window:last-of-type");
    const headerEl = windowEl.querySelector(".exe-header");
    const bodyEl = windowEl.querySelector(".exe-body");
    const promptEl = windowEl.querySelector(".exe-prompt");

    // ✅ stable header text
    const headerText = `
ooo        ooooo                 .o.        .o88o.                     
\`88.       .888'                .888.       888 \`"                     
 888b     d'888   .ooooo.      .8"888.     o888oo   .ooooo.   .ooooo.  
 8 Y88. .P  888  d88' \`"Y8    .8' \`888.     888    d88' \`88b d88' \`88b 
 8  \`888'   888  888         .88ooo8888.    888    888ooo888 888ooo888 
 8    Y     888  888   .o8  .8'     \`888.   888    888    .o 888    .o 
o8o        o888o \`Y8bod8P' o88o     o8888o o888o   \`Y8bod8P' \`Y8bod8P' 


========================================================================================

Location................................................................ Remote, Toronto
Position.................................................................. UX Researcher
Duration................................................................. May 2025 - Now
Details.............................................................. Confidential (NDA)
Domain................................................................ Software Security

========================================================================================
`;
    headerEl.textContent = headerText;

    // ✅ load projects from external file
    fetch("mcafee_projects.txt")
      .then(res => res.text())
      .then(fileText => {
        const pages = fileText.split("===PAGE===")
          .map(p => p.trim())
          .filter(p => p.length > 0);

        let pageIndex = 0;
        let typing = false;
        let skipMode = false;

        function typeWriter(text, callback) {
          typing = true;
          skipMode = false;
          bodyEl.textContent = "";
          let i = 0;

          function step() {
            if (skipMode) {
              // print instantly
              bodyEl.textContent = text;
              typing = false;
              if (callback) callback();
              return;
            }

            if (i < text.length) {
              bodyEl.textContent += text.charAt(i);
              i++;
              setTimeout(step, 15);
            } else {
              typing = false;
              if (callback) callback();
            }
          }
          step();
        }

        function loadNextPage() {
          if (typing) {
            // skip current typing
            skipMode = true;
            return;
          }

          if (pageIndex < pages.length) {
            bodyEl.classList.add("fade-out");
            setTimeout(() => {
              bodyEl.classList.remove("fade-out");
              typeWriter(pages[pageIndex], () => {
                promptEl.style.display = "block";
              });
              pageIndex++;
            }, 300);
            promptEl.style.display = "none";
          } else {
            // ✅ End of report → offer restart
            bodyEl.textContent = "";
            promptEl.innerHTML = "<span>End of Report — Press Enter/Click to Start Over</span>";
            pageIndex = 0; // reset for restart
          }
        }

        // first prompt
        promptEl.style.display = "block";

        // triggers
        promptEl.addEventListener("click", loadNextPage);
        document.addEventListener("keydown", (e) => {
          if (e.key === "Enter") loadNextPage();
        });
      });

    // close button
    windowEl.querySelector(".close-btn").addEventListener("click", () => {
      windowEl.remove();
    });

    makeDraggable(windowEl);
  });

  function makeDraggable(win) {
    const titleBar = win.querySelector(".title-bar");
    let isDragging = false, offsetX = 0, offsetY = 0;

    titleBar.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
      win.style.zIndex = 9999;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return; // Only move if dragging
      let newLeft = e.clientX - offsetX; // Calculate new left position
      let newTop = e.clientY - offsetY;  // Calculate new top position
      // Clamp left position within viewport
      newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - win.offsetWidth));
      // Clamp top position within viewport
      newTop = Math.max(0, Math.min(newTop, window.innerHeight - win.offsetHeight));
      win.style.left = `${newLeft}px`; // Set window left position
      win.style.top = `${newTop}px`;   // Set window top position
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }
});
