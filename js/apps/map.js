// js/apps/travelmap.js
document.addEventListener("DOMContentLoaded", () => {
  window.Apps = window.Apps || {};

  function openTravelMap() {
    if (window.SoundFX) { window.SoundFX.click?.();}

    const tpl = document.getElementById("travelmap-template");
    if (!tpl) return console.error("❌ TravelMap template missing");

    const win = tpl.content.firstElementChild.cloneNode(true);
    win.style.display = "flex";


    if (isMobile()) {
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
    } else {
       
      const margin = 20;
      const defaultWidth = 700;
      const defaultHeight = 500;
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
      const safeLeft = Math.random() * (maxWidth - parseInt(win.style.width));
      const safeTop = Math.random() * (maxHeight - parseInt(win.style.height));
      win.style.left = safeLeft + margin + "px";
      win.style.top = safeTop + margin + "px";
    }

    // Close button
    win.querySelector(".close-btn").addEventListener("click", () => {
      if (window.SoundFX) window.SoundFX.click?.();
      win.remove();
    });
    // Add to DOM + enable dragging
    document.body.appendChild(win);
    makeDraggable(win);
    bringToFront(win);

    // ----------------------------
    // Map init
    // ----------------------------
    function initMap(containerSelector) {
      const map = L.map(win.querySelector(containerSelector), {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 5,
        worldCopyJump: true,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0
      });

      L.tileLayer(
        "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            "&copy; <a href='https://www.openstreetmap.org/'>OSM</a> &copy; <a href='https://carto.com/'>CARTO</a>",
          subdomains: "abcd",
          maxZoom: 19
        }
      ).addTo(map);

      return map;
    }

    const visitedMap = initMap("#xp-map");
    const toVisitMap = initMap("#xp-map-to-visit");
    const favoritesMap = initMap("#xp-map-favorites");

    // ----------------------------
    // Markers
    // ----------------------------
    const visitedGroups = [
      {
      group: "Canada",
      reason: "travel, family, nature",
      color: "blue",
      places: [
        { place: "Vancouver", coords: [49.28, -123.12] },
        { place: "Montreal", coords: [45.5, -73.57] },
        { place: "Quebec", coords: [46.81, -71.21] },
        { place: "Ottawa", coords: [45.42, -75.69] },
        { place: "Algonquin National Park", coords: [45.83, -78.37] },
        { place: "Niagara Falls", coords: [43.08, -79.07] }
      ]
      },
      {
      group: "Ukraine",
      reason: "Explored my home country",
      color: "red",
      places: [
        { place: "Lviv", coords: [49.84, 24.03] },
        { place: "Kyiv", coords: [50.45, 30.52] },
        { place: "Odesa", coords: [46.48, 30.73] },
        { place: "Kharkiv", coords: [49.99, 36.23] },
        { place: "Chernivtsi", coords: [48.29, 25.93] },
        { place: "Ivano-Frankivsk", coords: [48.92, 24.71] },
        { place: "Ternopil", coords: [49.55, 25.6] },
        { place: "Kamianets-Podilskyi", coords: [48.68, 26.58] },
        { place: "Vinnytsia", coords: [49.23, 28.47] },
        { place: "Poltava", coords: [49.59, 34.55] },
        { place: "Rivne", coords: [50.62, 26.25] },
        { place: "Dnipro", coords: [48.45, 34.98] },
        { place: "Uzhhorod", coords: [48.62, 22.29] },
        { place: "Hoverla Mountain", coords: [48.15, 24.5] },
        { place: "Shatsky Lakes", coords: [51.5, 24.0] },
        { place: "Rubizhne", coords: [49.01, 38.37] }
      ]
      },
      {
      group: "Camino de Santiago 2023",
      reason: "Walked the Camino Portuguese route, 250km",
      color: "green",
      places: [
        { place: "Santiago de Compostella", coords: [42.88, -8.54] },
        { place: "Porto", coords: [41.15, -8.61] },
      ]
      },
      {
      group: "Burning Man 2024",
      reason: "Special thanks to my dear friend for invite",
      color: "black",
      places: [
        { place: "Black Rock Desert", coords: [40.78, -119.19] },
            ]
      },
      {
      group: "Home",
      reason: "I lived here for longer periods of time",
      color: "orange",
      places: [
        { place: "Toronto", coords: [43.7, -79.4] },
        { place: "Lviv", coords: [49.84, 24.03] },
        { place: "Kyiv", coords: [50.45, 30.52] },
        { place: "Bratislava", coords: [48.15, 17.11] },
        { place: "Kharkiv", coords: [49.99, 36.23] }
      ]
      },
      {
      group: "Layback vacations",
      reason: "Vacation",
      color: "yellow",
      places: [
        { place: "Punta Cana", coords: [18.58, -68.4] },
        { place: "Antalya", coords: [36.89, 30.7] },
        { place: "Poborie", coords: [42.55, 27.46] }, // Bulgaria
        { place: "Koblevo", coords: [46.95, 31.92] }, // Ukraine
        
      ]
      },
      {
      group: "Various places",
      reason: "travel, family",
      color: "violet",
      places: [
        { place: "San Francisco", coords: [37.77, -122.42] },
        { place: "Los Angeles", coords: [34.05, -118.24] },
        { place: "Chicago", coords: [41.88, -87.63] },
        { place: "Denver", coords: [39.74, -104.99] },
        { place: "Las Vegas", coords: [36.17, -115.14] },
        { place: "Seattle", coords: [47.61, -122.33] },
        { place: "New York", coords: [40.71, -74.01] },
        { place: "Barcelona", coords: [41.38, 2.17] },
        { place: "Prague", coords: [50.08, 14.44] },
        { place: "Vienna", coords: [48.21, 16.37] },
        { place: "Budapest", coords: [47.5, 19.04] },
        { place: "Rome", coords: [41.9, 12.5] },
        { place: "Amsterdam", coords: [52.37, 4.89] },
        { place: "Lisbon", coords: [38.72, -9.14] },
        { place: "Oslo", coords: [59.91, 10.75] },
        { place: "Helsinki", coords: [60.17, 24.94] },
        { place: "Warsaw", coords: [52.23, 21.01] },
        { place: "Krakow", coords: [50.06, 19.94] },
        { place: "Wroclaw", coords: [51.11, 17.03] },
        { place: "Madrid", coords: [40.42, -3.7] },
        { place: "Naples", coords: [40.85, 14.27] },
        { place: "Palinuro", coords: [40.04, 15.29] },
        { place: "Brugges", coords: [51.21, 3.22] },
        { place: "Brussels", coords: [50.85, 4.35] },
        { place: "Berlin", coords: [52.52, 13.40] },
        { place: "Paris", coords: [48.86, 2.35] },
        { place: "Caen", coords: [49.18, -0.37] },
        { place: "Tampere", coords: [61.50, 23.77] },
        { place: "Vilnius", coords: [54.69, 25.28] },
        { place: "Tallinn", coords: [59.44, 24.75] },
        { place: "Mount Saint Michael", coords: [48.636, -1.511] },
        { place: "Jerusalem", coords: [31.78, 35.22] },
        { place: "Tel Aviv", coords: [32.08, 34.78] },
        { place: "Cyprus", coords: [35.18, 33.36] },
        { place: "Reykjavik", coords: [64.13, -21.9] },
        { place: "Copenhagen", coords: [55.68, 12.57] },
        { place: "Aarhus", coords: [56.16, 10.21] },
        { place: "Cologne", coords: [50.94, 6.96] },
        { place: "Berlin", coords: [52.52, 13.40] },
        { place: "Krakow", coords: [50.06, 19.94] },
        { place: "Amsterdam", coords: [52.37, 4.89] },
        { place: "Antwerp", coords: [51.22, 4.40] },
        { place: "Warsaw", coords: [52.23, 21.01] },
        { place: "Hamburg", coords: [53.55, 9.99] },
      ]
      }
    ];

   
    const toVisit = [
      { place: "New Zealand", coords: [-40.90, 174.89] },
      { place: "Switzerland", coords: [46.82, 8.23] },
      { place: "Greece", coords: [39.07, 21.82] },
      { place: "South Korea", coords: [35.91, 127.77] },
      { place: "Japan", coords: [36.20, 138.25] },
      { place: "Bali", coords: [-8.34, 115.09] },
      { place: "Ireland", coords: [53.35, -6.26] },
      { place: "Australia", coords: [-25.27, 133.77] },
      { place: "North Pole", coords: [90, 0] },
      { place: "Chile", coords: [-33.44, -70.65] },
      { place: "Egypt", coords: [26.82, 30.80] },
      { place: "India", coords: [20.59, 78.96] },
      { place: "China", coords: [35.86, 104.19] },
  
    ];
    const favorites = [
        { place: "Lviv", coords: [49.84, 24.03] }
    ];    
    // Render visited with group color + popup
    visitedGroups.forEach(g => {
      g.places.forEach(t => {
        L.marker(t.coords, {
          icon: L.icon({
            iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${g.color}.png`,
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        })
          .addTo(visitedMap)
          .bindPopup(`<b>${t.place}</b><br><i>${g.group}</i><br>${g.reason}`);
      });
    });

    toVisit.forEach(t =>
      L.marker(t.coords).addTo(toVisitMap).bindPopup(t.place)
    );
    favorites.forEach(t =>
      L.marker(t.coords).addTo(favoritesMap).bindPopup(t.place)
    );

    // ----------------------------
    // Tab switching
    // ----------------------------
    win.querySelectorAll(".tab-btn").forEach(btn => {
      
      btn.addEventListener("click", () => {
        win.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const target = btn.dataset.tab;
        win.querySelectorAll(".map-tab").forEach(tab => {
          tab.classList.toggle("hidden", tab.dataset.tab !== target);
        });

        if (target === "visited") visitedMap.invalidateSize();
        if (target === "to-visit") toVisitMap.invalidateSize();
        if (target === "favorites") favoritesMap.invalidateSize();
      });
    });

    // ----------------------------
    // Handle resizing
    // ----------------------------
    const resizeObserver = new ResizeObserver(() => {
      visitedMap.invalidateSize();
      toVisitMap.invalidateSize();
      favoritesMap.invalidateSize();
    });
    resizeObserver.observe(win.querySelector(".map-container"));

    // Fix size on load
    setTimeout(() => visitedMap.invalidateSize(), 100);

    console.log("✅ TravelMap opened");
  }

  // Export API
  window.Apps.TravelMap = { open: openTravelMap };

  // Attach to icon
  const mapIcon = document.getElementById("map-icon");
  if (mapIcon) {
    const handler = () => {
      openTravelMap();
    };
    if (isMobile()) mapIcon.addEventListener("click", handler);
    else mapIcon.addEventListener("dblclick", handler);
  }
});
