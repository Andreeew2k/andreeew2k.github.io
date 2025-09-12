// js/apps/exe.js
document.addEventListener("DOMContentLoaded", () => {
  window.Apps = window.Apps || {};

  function openExe() {
    const tpl = document.getElementById("exe-template");
    if (!tpl) return console.error("❌ Exe template missing");


    // Prevent multiple windows
    let existing = document.querySelector(".exe-window");
    if (existing) {
      existing.style.display = "block";
      bringToFront(existing);
      return;
    }

    const win = tpl.content.firstElementChild.cloneNode(true);
    win.style.display = "flex";

    // Desktop margins
    const margin = 20;
    const defaultWidth = 500;
    const defaultHeight = 500;
    const maxWidth = window.innerWidth - margin * 2;
    const maxHeight = window.innerHeight - margin * 2;

    // Constraints
    win.style.minWidth = "300px";
    win.style.maxWidth = maxWidth + "px";
    win.style.maxHeight = maxHeight + "px";

    // Height based on lines
    const bodyEl = win.querySelector(".exe-body");
    const lineHeight = parseFloat(getComputedStyle(bodyEl).lineHeight || 18);
    const minHeight = lineHeight * 32 + 120; // header + prompt
    win.style.minHeight = Math.min(minHeight, maxHeight) + "px";

    // Initial size
    win.style.width = Math.min(defaultWidth, maxWidth) + "px";
    win.style.height = Math.min(defaultHeight, maxHeight) + "px";

    // Randomized safe spawn (left half of screen)
    const safeLeft = Math.random() * (maxWidth / 2 - parseInt(win.style.width));
    const safeTop = Math.random() * (maxHeight - parseInt(win.style.height));
    win.style.left = safeLeft + margin + "px";
    win.style.top = safeTop + margin + "px";

    // Header text (ASCII art + info)
    const headerEl = win.querySelector(".exe-header");
    const promptEl = win.querySelector(".exe-prompt");
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
    const headerMobileText = `
                                              
 ▄    ▄         ▄▄    ▄▀▀               
 ██  ██  ▄▄▄    ██  ▄▄█▄▄  ▄▄▄   ▄▄▄  
 █ ██ █ █▀  ▀  █  █   █   █▀  █ █▀  █ 
 █ ▀▀ █ █      █▄▄█   █   █▀▀▀▀ █▀▀▀▀ 
 █    █ ▀█▄▄▀ █    █  █   ▀█▄▄▀ ▀█▄▄▀ 
                                      
                                      
 ======================================
 Location.............. Remote, Toronto
 Position................ UX Researcher
 Duration............... May 2025 - Now
 Details............ Confidential (NDA)
 Domain.............. Software Security
 ======================================
 `;

    headerEl.textContent = headerMobileText;

    // Measure header width and adjust minWidth
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
    }
    const headerMinWidth = Math.min(headerWidth + 40, maxWidth);
    win.style.minWidth = headerMinWidth + "px";
    if (parseInt(win.style.width) < headerMinWidth) {
      win.style.width = headerMinWidth + "px";
    }

    // Body typing effect
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
            skipMode = true;
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

        promptEl.style.display = "block";
        promptEl.textContent = "Press Enter/Click to Continue";

        // Triggers
        win.addEventListener("click", e => {
          if (e.target.closest(".title-bar")) return;
          loadNextPage();
        });
        document.addEventListener("keydown", e => {
          if (e.key === "Enter") loadNextPage();
        });
      })
      .catch(err => {
        bodyEl.textContent = "❌ Failed to load mcafee_projects.txt";
        console.error(err);
      });

    // Close button
    win.querySelector(".close-btn").addEventListener("click", () => win.remove());

    // Add to DOM + make draggable
    document.body.appendChild(win);
    makeDraggable(win);
    bringToFront(win);

    console.log("✅ Exe window opened");
  }

  // Export API
  window.Apps.Exe = { open: openExe };

  // Attach to icon
  const exeIcon = document.getElementById("exe-icon");
  if (exeIcon) {
    const handler = () => {
      if (window.SoundFX) { window.SoundFX.click?.(); }
      openExe();
    };
    if (isMobile()) exeIcon.addEventListener("click", handler);
    else exeIcon.addEventListener("dblclick", handler);
  }
});
