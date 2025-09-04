document.addEventListener("DOMContentLoaded", () => {
  const tpl = document.getElementById("travelmap-template");
  const mapIcon = document.getElementById("map-icon");

  // ✅ Make window draggable
  function makeDraggable(win) {
    const titleBar = win.querySelector(".title-bar");
    let isDragging = false, offsetX = 0, offsetY = 0;

    titleBar.addEventListener("mousedown", e => {
      isDragging = true;
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
    });

    document.addEventListener("mousemove", e => {
      if (!isDragging) return;
      win.style.left = e.clientX - offsetX + "px";
      win.style.top = e.clientY - offsetY + "px";
    });

    document.addEventListener("mouseup", () => isDragging = false);
  }

  function openTravelMap() {
    const win = tpl.content.firstElementChild.cloneNode(true);
    win.style.display = "flex";
    document.body.appendChild(win);

    // ✅ Close button
    win.querySelector(".close-btn").addEventListener("click", () => win.remove());

    // ✅ Make draggable
    makeDraggable(win);

    // ✅ Init maps with zoom limits
    function initMap(containerId) {
      const map = L.map(win.querySelector(containerId), {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 5,
        worldCopyJump: true
      });

      L.tileLayer("https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; <a href='https://www.openstreetmap.org/'>OSM</a> &copy; <a href='https://carto.com/'>CARTO</a>",
        subdomains: "abcd",
        maxZoom: 19
      }).addTo(map);

      return map;
    }

    const visitedMap = initMap("#xp-map");
    const toVisitMap = initMap("#xp-map-to-visit");
    const favoritesMap = initMap("#xp-map-favorites");

    // ✅ Predefined pins
    const visited = [
      { place: "Toronto", coords: [43.7, -79.4] },
      { place: "Kyiv", coords: [50.45, 30.52] },
      { place: "Barcelona", coords: [41.38, 2.17] }
    ];
    const toVisit = [
      { place: "Sydney", coords: [-33.87, 151.21] },
      { place: "Cape Town", coords: [-33.92, 18.42] }
    ];
    const favorites = [
      { place: "New York", coords: [40.71, -74.01] },
      { place: "Tokyo", coords: [35.68, 139.69] }
    ];

    visited.forEach(t => L.marker(t.coords).addTo(visitedMap).bindPopup(t.place));
    toVisit.forEach(t => L.marker(t.coords).addTo(toVisitMap).bindPopup(t.place));
    favorites.forEach(t => L.marker(t.coords).addTo(favoritesMap).bindPopup(t.place));

    // ✅ Tab switching
    win.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        // Switch active button
        win.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Show selected map tab
        const target = btn.dataset.tab;
        win.querySelectorAll(".map-tab").forEach(tab => {
          tab.classList.toggle("hidden", tab.dataset.tab !== target);
        });

        // Fix map rendering after tab switch
        if (target === "visited") visitedMap.invalidateSize();
        if (target === "to-visit") toVisitMap.invalidateSize();
        if (target === "favorites") favoritesMap.invalidateSize();
      });
    });

    // ✅ Observe resizing of the XP window
    const resizeObserver = new ResizeObserver(() => {
      visitedMap.invalidateSize();
      toVisitMap.invalidateSize();
      favoritesMap.invalidateSize();
    });
    resizeObserver.observe(win.querySelector(".map-container"));

    // ✅ Default: open "Visited" tab and fix size
    setTimeout(() => visitedMap.invalidateSize(), 100);
  }

  // ✅ Attach handler to icon
  if (mapIcon) {
    mapIcon.addEventListener("dblclick", () => {
      if (window.SoundFX) SoundFX.open();
      openTravelMap();
    });
  }
});
