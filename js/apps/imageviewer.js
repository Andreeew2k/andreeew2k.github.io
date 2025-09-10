// js/apps/imageviewer.js
document.addEventListener("DOMContentLoaded", () => {
  window.Apps = window.Apps || {};

  function openImageViewer(images = []) {
    const tpl = document.getElementById("imageviewer-template");
    if (!tpl) return console.error("❌ ImageViewer template missing");

    const win = tpl.content.firstElementChild.cloneNode(true);
    win.style.display = "block";

    const margin = 20;
    const defaultWidth = 800;
    const defaultHeight = 600;
    const maxWidth = window.innerWidth - margin * 2;
    const maxHeight = window.innerHeight - margin * 2;

    // Constraints
    win.style.minWidth = "400px";
    win.style.minHeight = "300px";
    win.style.maxWidth = maxWidth + "px";
    win.style.maxHeight = maxHeight + "px";

    // Initial size
    win.style.width = Math.min(defaultWidth, maxWidth) + "px";
    win.style.height = Math.min(defaultHeight, maxHeight) + "px";

    // ✅ Safe spawn logic (right half of screen, clamped to viewport)
    const winWidth = parseInt(win.style.width);
    const winHeight = parseInt(win.style.height);

    const minLeft = Math.floor(window.innerWidth / 2);
    const maxLeft = Math.max(minLeft, window.innerWidth - winWidth - margin);
    const safeLeft = Math.floor(Math.random() * (maxLeft - minLeft + 1) + minLeft);

    const minTop = margin;
    const maxTop = Math.max(minTop, window.innerHeight - winHeight - margin);
    const safeTop = Math.floor(Math.random() * (maxTop - minTop + 1) + minTop);

    win.style.left = safeLeft + "px";
    win.style.top = safeTop + "px";

    // Add to DOM
    document.body.appendChild(win);
    makeDraggable(win);
    bringToFront(win);

    // ----------------------------
    // Viewer logic
    // ----------------------------
    let currentIndex = 0, rotation = 0, zoom = 1;
    let slideshowInterval = null;
    const img = win.querySelector("img");
    const title = win.querySelector(".window-title");
    const slideshowBtn = win.querySelector(".slideshow");

    function showImage(index) {
      if (!images.length) return;
      img.src = images[index];
      const name = images[index].split("/").pop();
      title.textContent = `${name} - Windows Picture and Fax Viewer`;
      img.style.transform = `rotate(${rotation}deg) scale(${zoom})`;
    }

    // Slideshow toggle
    slideshowBtn.addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click?.();

      if (slideshowInterval) {
        // 🔴 Stop slideshow
        clearInterval(slideshowInterval);
        slideshowInterval = null;
        slideshowBtn.classList.remove("active");
      } else {
        // 🟢 Start slideshow
        slideshowInterval = setInterval(() => {
          currentIndex = (currentIndex + 1) % images.length;
          rotation = 0; zoom = 1;
          showImage(currentIndex);
        }, 3000);
        slideshowBtn.classList.add("active");
      }
    });

    // Close button
    win.querySelector(".close-btn").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click?.();
      win.remove();
    });

    // Controls
    win.querySelector(".prev-btn").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click?.();
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      rotation = 0; zoom = 1;
      showImage(currentIndex);
    });

    win.querySelector(".next-btn").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click?.();
      currentIndex = (currentIndex + 1) % images.length;
      rotation = 0; zoom = 1;
      showImage(currentIndex);
    });

    win.querySelector(".rotate-left").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click?.();
      rotation -= 90;
      showImage(currentIndex);
    });

    win.querySelector(".rotate-right").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click?.();
      rotation += 90;
      showImage(currentIndex);
    });

    win.querySelector(".zoom-in").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click?.();
      zoom += 0.1;
      showImage(currentIndex);
    });

    win.querySelector(".zoom-out").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click?.();
      zoom = Math.max(0.1, zoom - 0.1);
      showImage(currentIndex);
    });

    win.querySelector(".slideshow").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click?.();
      setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        rotation = 0; zoom = 1;
        showImage(currentIndex);
      }, 3000);
    });

    // Show first image
    if (images.length) showImage(currentIndex);
  }

  // Export API
  window.Apps.ImageViewer = { open: openImageViewer };

  // ----------------------------
  // Helpers
  // ----------------------------
  function putMeFirst(arr) {
    let shuffled = arr.sort(() => Math.random() - 0.5);
    const meIndex = shuffled.findIndex(img =>
      img.toLowerCase().includes("hi_its_me_andrii")
    );
    if (meIndex > -1) {
      const [meImage] = shuffled.splice(meIndex, 1);
      shuffled.unshift(meImage);
    }
    return shuffled;
  }

  // ----------------------------
  // Icon click → shuffle only
  // ----------------------------
  const imagesIcon = document.getElementById("images-icon");
  if (imagesIcon) {
    const handler = () => {
      if (window.SoundFX) SoundFX.click?.();
      fetch("images.json")
        .then(res => res.json())
        .then(data => {
          const shuffled = data.sort(() => Math.random() - 0.5);
          openImageViewer(shuffled);
        })
        .catch(err => console.error("❌ Could not load images.json", err));
    };

    if (isMobile()) imagesIcon.addEventListener("click", handler);
    else imagesIcon.addEventListener("dblclick", handler);
  }

  // ----------------------------
  // Auto-start on desktop → "me" first
  // ----------------------------
  if (!isMobile()) {
    fetch("images.json")
      .then(res => res.json())
      .then(data => {
        const withMeFirst = putMeFirst(data);
        openImageViewer(withMeFirst);
      })
      .catch(err => console.error("❌ Could not load images.json", err));
  }
});
