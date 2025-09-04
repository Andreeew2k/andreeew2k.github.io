// window-manager.js

// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {

  // Function to bring a window element to the front by increasing its z-index
  function bringToFront(win) {
    let maxZ = 100; // Start with a base z-index
    // Iterate over all elements with the class "window"
    document.querySelectorAll(".window").forEach(w => {
      // Get the current z-index of the window
      const z = parseInt(window.getComputedStyle(w).zIndex) || 0;
      // Update maxZ if this window has a higher z-index
      if (z > maxZ) maxZ = z;
    });
    // Set the z-index of the selected window to be higher than all others
    win.style.zIndex = maxZ + 1;
  }

  // Make bringToFront globally accessible
  window.bringToFront = bringToFront;

  // Listen for mouse down events on the document
  document.addEventListener("mousedown", e => {
    // Find the closest ancestor with the class "window"
    const win = e.target.closest(".window");
    // If a window was clicked, bring it to the front
    if (win) bringToFront(win);
  });

  // Selection box element for drag selection
  const selectionBox = document.getElementById("selection-box");
  // Variables to store the starting coordinates and selection state
  let startX, startY, isSelecting = false;

  // Listen for mouse down events to start selection
  document.addEventListener("mousedown", e => {
    // Only start selection if not clicking on an icon or window
    if (!e.target.closest(".icon") && !e.target.closest(".window")) {
      isSelecting = true; // Set selection state
      startX = e.pageX; // Store starting X coordinate
      startY = e.pageY; // Store starting Y coordinate
      // Position and size the selection box at the starting point
      selectionBox.style.left = `${startX}px`;
      selectionBox.style.top = `${startY}px`;
      selectionBox.style.width = "0px";
      selectionBox.style.height = "0px";
      selectionBox.style.display = "block"; // Show the selection box
    }
  });

  // Listen for mouse move events to resize the selection box
  document.addEventListener("mousemove", e => {
    if (!isSelecting) return; // Only run if selection is active
    // Clamp mouse coordinates within the window bounds
    const mouseX = Math.max(0, Math.min(e.pageX, window.innerWidth));
    const mouseY = Math.max(0, Math.min(e.pageY, window.innerHeight));
    // Calculate the top-left corner of the selection box
    const x = Math.min(mouseX, startX);
    const y = Math.min(mouseY, startY);
    // Calculate the width and height of the selection box
    const w = Math.abs(mouseX - startX);
    const h = Math.abs(mouseY - startY);
    // Update the selection box position and size
    selectionBox.style.left = `${x}px`;
    selectionBox.style.top = `${y}px`;
    selectionBox.style.width = `${w}px`;
    selectionBox.style.height = `${h}px`;
  });

  // Listen for mouse up events to end selection
  document.addEventListener("mouseup", () => {
    if (isSelecting) {
      isSelecting = false; // Reset selection state
      selectionBox.style.display = "none"; // Hide the selection box
    }
  });

  // Helper function to detect if the user is on a mobile device
  function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  // Add event handlers to icons with a data-link attribute
  document.querySelectorAll('.icon[data-link]').forEach(icon => {
    // Handler function to open the link
    const handler = () => {
      const url = icon.dataset.link; // Get the URL from the data-link attribute
      if (url) {
        // Play sound effects if available
        if (window.SoundFX) {
          SoundFX.open();
          SoundFX.click();
        }
        // Open the link in a new tab
        window.open(url, "_blank");
      }
    };

    // Use click for mobile, double-click for desktop
    if (isMobile()) {
      icon.addEventListener("click", handler);
    } else {
      icon.addEventListener("dblclick", handler);
    }
  });
});
