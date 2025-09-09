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

    const margin = 20;
    const defaultWidth = 700;
    const defaultHeight = 500;
    const maxWidth = window.innerWidth - margin * 2;
    const maxHeight = window.innerHeight - margin * 2;

    // ✅ base min sizes
    const minWidth = 400;
    windowEl.style.minWidth = minWidth + "px";
    windowEl.style.maxWidth = maxWidth + "px";
    windowEl.style.maxHeight = maxHeight + "px";

    // ✅ ensure height can show at least 20 lines
    const lineHeight = parseFloat(getComputedStyle(bodyEl).lineHeight || 18);
    const minHeight = lineHeight * 32 + 120; // add space for header + prompt
    windowEl.style.minHeight = Math.min(minHeight, maxHeight) + "px";

    // initial size
    windowEl.style.width = Math.min(defaultWidth, maxWidth) + "px";
    windowEl.style.height = Math.min(defaultHeight, maxHeight) + "px";

    // spawn position (desktop: only left half)
    const safeLeft = Math.random() * (maxWidth / 2 - parseInt(windowEl.style.width));
    const safeTop = Math.random() * (maxHeight - parseInt(windowEl.style.height));
    windowEl.style.left = safeLeft + margin + "px";
    windowEl.style.top = safeTop + margin + "px";

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

    // ✅ measure header width in pixels
    const tempSpan = document.createElement("span");
    tempSpan.style.visibility = "hidden";
    tempSpan.style.position = "absolute";
    tempSpan.style.whiteSpace = "pre";
    tempSpan.style.fontFamily = getComputedStyle(headerEl).fontFamily;
    tempSpan.style.fontSize = getComputedStyle(headerEl).fontSize;
    tempSpan.textContent = headerText;
    document.body.appendChild(tempSpan);
    const headerWidth = tempSpan.getBoundingClientRect().width;
    tempSpan.remove();

    const headerMinWidth = Math.min(headerWidth + 40, maxWidth);
    windowEl.style.minWidth = headerMinWidth + "px";
    if (parseInt(windowEl.style.width) < headerMinWidth) {
      windowEl.style.width = headerMinWidth + "px";
    }

    // ✅ load projects
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
            skipMode = true; // skip current typing
            return;
          }
          if (pageIndex < pages.length) {
            bodyEl.classList.add("fade-out");
            setTimeout(() => {
              bodyEl.classList.remove("fade-out");
              typeWriter(pages[pageIndex], () => {
                promptEl.textContent = "Press Enter/Click to Continue";
                promptEl.style.display = "block";
              });
              pageIndex++;
            }, 300);
            promptEl.style.display = "none";
          } else {
            bodyEl.textContent = "";
            promptEl.textContent = "End of Report — Press Enter/Click to Start Over";
            pageIndex = 0;
          }
        }

        // ✅ triggers
        promptEl.style.display = "block";
        promptEl.textContent = "Press Enter/Click to Continue";

        // click inside window but NOT the title bar/close button → skip
        windowEl.addEventListener("click", (e) => {
          if (e.target.closest(".title-bar")) return; // ignore title bar + buttons
          loadNextPage();
        });

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
      if (!isDragging) return;
      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;
      newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - win.offsetWidth));
      newTop = Math.max(0, Math.min(newTop, window.innerHeight - win.offsetHeight));
      win.style.left = `${newLeft}px`;
      win.style.top = `${newTop}px`;
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }
});
