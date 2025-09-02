// imageviewer.js
document.addEventListener("DOMContentLoaded", () => {
  const tpl = document.getElementById("imageviewer-template");

  function makeDraggable(win) {
    const titleBar = win.querySelector(".title-bar");
    let isDragging = false, offsetX = 0, offsetY = 0;

    titleBar.addEventListener("mousedown", e => {
      isDragging = true;
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
      if (window.bringToFront) window.bringToFront(win);
    });

    document.addEventListener("mousemove", e => {
      if (!isDragging) return;
      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;
      newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - win.offsetWidth));
      newTop = Math.max(0, Math.min(newTop, window.innerHeight - win.offsetHeight));
      win.style.left = `${newLeft}px`;
      win.style.top = `${newTop}px`;
    });

    document.addEventListener("mouseup", () => isDragging = false);
  }

  function openImageViewer(images = []) {
    const win = tpl.content.firstElementChild.cloneNode(true);
    win.style.display = "block";

    // Append first so offsetWidth/offsetHeight are measurable
    document.body.appendChild(win);

    // Calculate safe position (within viewport, right half only)
    const winWidth = win.offsetWidth || 500;  // fallback
    const winHeight = win.offsetHeight || 400;

    // define horizontal bounds
    const minLeft = Math.floor(window.innerWidth * 0.5); // 50% of screen
    const maxLeft = Math.max(minLeft, window.innerWidth - winWidth - 20); // keep 20px margin

    // define vertical bounds
    const minTop = 0;
    const maxTop = Math.max(0, window.innerHeight - winHeight - 20);

    const left = Math.floor(Math.random() * (maxLeft - minLeft + 1) + minLeft);
    const top = Math.floor(Math.random() * (maxTop - minTop + 1) + minTop);

    win.style.left = left + "px";
    win.style.top = top + "px";


    if (window.bringToFront) window.bringToFront(win);

    let currentIndex = 0, rotation = 0, zoom = 1;
    const img = win.querySelector("img");
    const title = win.querySelector(".window-title");

    function showImage(index) {
      if (!images.length) return;
      img.src = images[index];
      const name = images[index].split("/").pop();
      title.textContent = `${name} - Windows Picture and Fax Viewer`;
      img.style.transform = `rotate(${rotation}deg) scale(${zoom})`;
    }

    win.querySelector(".close-btn").addEventListener("click", () => {
      SoundFX.click();  // 👈 add this line
      win.remove();
    });
    win.querySelector(".prev-btn").addEventListener("click", () => {
      SoundFX.click();  // 👈 add this line
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      rotation = 0; zoom = 1; showImage(currentIndex);
    });
    win.querySelector(".next-btn").addEventListener("click", () => {
      SoundFX.click();  // 👈 add this line
      currentIndex = (currentIndex + 1) % images.length;
      rotation = 0; zoom = 1; showImage(currentIndex);
    });
    win.querySelector(".rotate-left").addEventListener("click", () => {
      SoundFX.click();  // 👈 add this line
      rotation -= 90; showImage(currentIndex);
    });
    win.querySelector(".rotate-right").addEventListener("click", () => {
      SoundFX.click();  // 👈 add this line
      rotation += 90; showImage(currentIndex);
    });
    win.querySelector(".zoom-in").addEventListener("click", () => {
      SoundFX.click();  // 👈 add this line
      zoom += 0.1; showImage(currentIndex);
    });
    win.querySelector(".zoom-out").addEventListener("click", () => {
      SoundFX.click();  // 👈 add this line
      zoom = Math.max(0.1, zoom - 0.1); showImage(currentIndex);
    });
    win.querySelector(".slideshow").addEventListener("click", () => {
      SoundFX.click();  // 👈 add this line
      setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        rotation = 0; zoom = 1;
        showImage(currentIndex);
      }, 3000);
    });

    if (images.length) showImage(currentIndex);

    makeDraggable(win);
    document.body.appendChild(win);
    if (window.bringToFront) window.bringToFront(win);
  }

  document.getElementById("images-icon").addEventListener("dblclick", () => {
    SoundFX.click();  // 👈 add this line
    fetch("images.json")
      .then(res => res.json())
      .then(data => {
        const shuffled = data.sort(() => Math.random() - 0.5);
        openImageViewer(shuffled);
      });
  });
  
  fetch("images.json")
  .then(res => res.json())
  .then(data => {
    const shuffled = data.sort(() => Math.random() - 0.5);
    openImageViewer(shuffled);
  });

});
