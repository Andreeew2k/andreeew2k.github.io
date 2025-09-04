// imageviewer.js

// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  // Get the image viewer template from the HTML
  const tpl = document.getElementById("imageviewer-template");

  // Function to make a window draggable
  function makeDraggable(win) {
    // Get the title bar element inside the window
    const titleBar = win.querySelector(".title-bar");
    // Variables to track dragging state and mouse offset
    let isDragging = false, offsetX = 0, offsetY = 0;

    // When mouse is pressed down on the title bar
    titleBar.addEventListener("mousedown", e => {
      isDragging = true; // Start dragging
      offsetX = e.clientX - win.offsetLeft; // Calculate X offset
      offsetY = e.clientY - win.offsetTop;  // Calculate Y offset
      // Bring window to front if function exists
      if (window.bringToFront) window.bringToFront(win);
    });

    // When mouse moves anywhere on the document
    document.addEventListener("mousemove", e => {
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

    // When mouse is released anywhere on the document
    document.addEventListener("mouseup", () => isDragging = false);
  }

  // Function to open the image viewer window
  function openImageViewer(images = []) {
    // Clone the template content to create a new window
    const win = tpl.content.firstElementChild.cloneNode(true);
    win.style.display = "block"; // Make window visible

    // Append window to body so its size can be measured
    document.body.appendChild(win);

    // Get window dimensions, fallback to defaults if not measurable
    const winWidth = win.offsetWidth || 500;
    const winHeight = win.offsetHeight || 400;
    // Calculate minimum and maximum left position (right half of screen)
    const minLeft = Math.floor(window.innerWidth * 0.5);
    const maxLeft = Math.max(minLeft, window.innerWidth - winWidth - 20);
    // Calculate minimum and maximum top position
    const minTop = 0;
    const maxTop = Math.max(0, window.innerHeight - winHeight - 20);

    // Randomize left position within allowed range
    const left = Math.floor(Math.random() * (maxLeft - minLeft + 1) + minLeft);
    // Randomize top position within allowed range
    const top = Math.floor(Math.random() * (maxTop - minTop + 1) + minTop);

    win.style.left = left + "px"; // Set window left position
    win.style.top = top + "px";   // Set window top position

    // Bring window to front if function exists
    if (window.bringToFront) window.bringToFront(win);

    // Initialize image index, rotation, and zoom
    let currentIndex = 0, rotation = 0, zoom = 1;
    // Get image and title elements inside the window
    const img = win.querySelector("img");
    const title = win.querySelector(".window-title");

    // Function to display the current image
    function showImage(index) {
      if (!images.length) return; // Do nothing if no images
      img.src = images[index]; // Set image source
      // Get image file name from path
      const name = images[index].split("/").pop();
      // Set window title
      title.textContent = `${name} - Windows Picture and Fax Viewer`;
      // Apply rotation and zoom to image
      img.style.transform = `rotate(${rotation}deg) scale(${zoom})`;
    }

    // Add event listener for close button
    win.querySelector(".close-btn").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click(); // Play sound if available
      win.remove(); // Remove window from DOM
    });
    // Add event listener for previous button
    win.querySelector(".prev-btn").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click(); // Play sound if available
      // Move to previous image, wrap around if needed
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      rotation = 0; zoom = 1; // Reset rotation and zoom
      showImage(currentIndex); // Show new image
    });
    // Add event listener for next button
    win.querySelector(".next-btn").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click(); // Play sound if available
      // Move to next image, wrap around if needed
      currentIndex = (currentIndex + 1) % images.length;
      rotation = 0; zoom = 1; // Reset rotation and zoom
      showImage(currentIndex); // Show new image
    });
    // Add event listener for rotate left button
    win.querySelector(".rotate-left").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click(); // Play sound if available
      rotation -= 90; // Rotate image left
      showImage(currentIndex); // Show rotated image
    });
    // Add event listener for rotate right button
    win.querySelector(".rotate-right").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click(); // Play sound if available
      rotation += 90; // Rotate image right
      showImage(currentIndex); // Show rotated image
    });
    // Add event listener for zoom in button
    win.querySelector(".zoom-in").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click(); // Play sound if available
      zoom += 0.1; // Increase zoom
      showImage(currentIndex); // Show zoomed image
    });
    // Add event listener for zoom out button
    win.querySelector(".zoom-out").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click(); // Play sound if available
      zoom = Math.max(0.1, zoom - 0.1); // Decrease zoom, minimum 0.1
      showImage(currentIndex); // Show zoomed image
    });
    // Add event listener for slideshow button
    win.querySelector(".slideshow").addEventListener("click", () => {
      if (window.SoundFX) SoundFX.click(); // Play sound if available
      // Start slideshow: change image every 3 seconds
      setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        rotation = 0; zoom = 1; // Reset rotation and zoom
        showImage(currentIndex); // Show next image
      }, 3000);
    });

    // Show the first image if images are available
    if (images.length) showImage(currentIndex);

    // Make the window draggable
    makeDraggable(win);
    // Bring window to front if function exists
    if (window.bringToFront) window.bringToFront(win);
  }

  // Function to detect if device is mobile
  function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  // Add event listener for double-click on images icon
  document.getElementById("images-icon").addEventListener("dblclick", () => {
    if (window.SoundFX) SoundFX.click(); // Play sound if available
    // Fetch image list from images.json
    fetch("images.json")
      .then(res => res.json()) // Parse JSON response
      .then(data => {
        // Shuffle images randomly
        const shuffled = data.sort(() => Math.random() - 0.5);
        // Open image viewer with shuffled images
        openImageViewer(shuffled);
      });
  });

  // Automatically open image viewer on desktop devices only
  if (!isMobile()) {
    // Fetch image list from images.json
    fetch("images.json")
      .then(res => res.json()) // Parse JSON response
      .then(data => {
        // Shuffle images randomly
        const shuffled = data.sort(() => Math.random() - 0.5);
        // Open image viewer with shuffled images
        openImageViewer(shuffled);
      });
  }
});
