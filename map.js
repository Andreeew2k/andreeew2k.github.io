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
      { place: "Barcelona", coords: [41.38, 2.17] },
      { place: "Bratislava", coords: [48.15, 17.11] },
        { place: "Prague", coords: [50.08, 14.44] },
        { place: "Vienna", coords: [48.21, 16.37] },
        { place: "Budapest", coords: [47.5, 19.04] },
        { place: "Rome", coords: [41.9, 12.5] },
        { place: "Amsterdam", coords: [52.37, 4.89] },
        { place: "Lisbon", coords: [38.72, -9.14] },
        { place: "Reykjavik", coords: [64.13, -21.9] },
        { place: "Copenhagen", coords: [55.68, 12.57] },
        { place: "Aarhus", coords: [56.16, 10.21] },
        { place: "Lviv", coords: [49.84, 24.03] },
        { place: "Oslo", coords: [59.91, 10.75] },
        { place: "Helsinki", coords: [60.17, 24.94] },
        { place: "Warsaw", coords: [52.23, 21.01] },
        { place: "Krakow", coords: [50.06, 19.94] },
        { place: "Wroclaw", coords: [51.11, 17.03] },
        { place: "Madrid", coords: [40.42, -3.7] },
        { place: "Antalya", coords: [36.89, 30.7] },
        { place: "Kharkiv", coords: [49.99, 36.23] },
        { place: "San Francisco", coords: [37.77, -122.42] },
        { place: "Los Angeles", coords: [34.05, -118.24] },
        { place: "Chicago", coords: [41.88, -87.63] },
        { place: "Vancouver", coords: [49.28, -123.12] },
        { place: "Montreal", coords: [45.5, -73.57] },
        { place: "Quebec", coords: [46.81, -71.21] },
        { place: "Punta Cana", coords: [18.58, -68.4] },
        { place: "Naples", coords: [40.85, 14.27] },
        { place: "Palinuro", coords: [40.04, 15.29] },
        { place: "Brugges", coords: [51.21, 3.22] },
        { place: "Brussels", coords: [50.85, 4.35] },
        { place: "Antwerp", coords: [51.22, 4.40] },
        { place: "Hamburg", coords: [53.55, 9.99] },
        { place: "Berlin", coords: [52.52, 13.40] },
        { place: "Paris", coords: [48.86, 2.35] },
        { place: "Caen", coords: [49.18, -0.37] },
        { place: "Black Rock Desert", coords: [40.78, -119.19] },
        { place: "Bruce National Park", coords: [44.92, -81.37] },
        { place: "Denver", coords: [39.74, -104.99] },
        { place: "Las Vegas", coords: [36.17, -115.14] },
        { place: "Seattle", coords: [47.61, -122.33] },
        { place: "Tampere", coords: [61.50, 23.77] },
        { place: "Vilnius", coords: [54.69, 25.28] },
        { place: "Tallinn", coords: [59.44, 24.75] },
        { place: "Mount Saint Michael", coords: [48.636, -1.511] },
        { place: "Odessa", coords: [46.48, 30.73] },
        { place: "New York", coords: [40.71, -74.01] },
        { place: "Santiago de Compostella", coords: [42.88, -8.54] },
        { place: "Porto", coords: [41.15, -8.61] },
        { place: "Algonquin National Park", coords: [45.83, -78.37] },
        { place: "Cologne", coords: [50.94, 6.96] },
        { place: "Jerusalem", coords: [31.78, 35.22] },
        { place: "Tel Aviv", coords: [32.08, 34.78] },
        { place: "Cyprus", coords: [35.18, 33.36] },
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
