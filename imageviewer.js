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
    document.body.appendChild(win);

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

    // Toolbar actions
    win.querySelector(".close-btn").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.close();
      win.remove();
    });
    win.querySelector(".prev-btn").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click();
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      rotation = 0; zoom = 1; showImage(currentIndex);
    });
    win.querySelector(".next-btn").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click();
      currentIndex = (currentIndex + 1) % images.length;
      rotation = 0; zoom = 1; showImage(currentIndex);
    });
    win.querySelector(".rotate-left").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click();
      rotation -= 90; showImage(currentIndex);
    });
    win.querySelector(".rotate-right").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click();
      rotation += 90; showImage(currentIndex);
    });
    win.querySelector(".zoom-in").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click();
      zoom += 0.1; showImage(currentIndex);
    });
    win.querySelector(".zoom-out").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click();
      zoom = Math.max(0.1, zoom - 0.1); showImage(currentIndex);
    });
    win.querySelector(".slideshow").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click();
      setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        rotation = 0; zoom = 1;
        showImage(currentIndex);
      }, 3000);
    });

    if (images.length) showImage(currentIndex);

    makeDraggable(win);
    if (window.bringToFront) window.bringToFront(win);
  }

  // Helper: detect mobile
  function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  // Common handler
  const handler = () => {
    if (window.SoundFX) {
      SoundFX.open();
      SoundFX.click();
    }
    fetch("images.json")
      .then(res => res.json())
      .then(data => {
        const shuffled = data.sort(() => Math.random() - 0.5);
        openImageViewer(shuffled);
      });
  };

  const imagesIcon = document.getElementById("images-icon");
  if (isMobile()) {
    imagesIcon.addEventListener("click", handler);   // one tap on mobile
  } else {
    imagesIcon.addEventListener("dblclick", handler); // double click on desktop

    // Auto-open on desktop only
    handler();
  }
});
