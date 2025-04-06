// Create the 'basemap' tile layer that will be the background of our map.
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
  
// Create the map object with center and zoom options.
let myMap = L.map("map", {
  center: [44.98, -93.27],
  zoom: 5
});
    
// Then add the 'basemap' tile layer to the map.
basemap.addTo(myMap);
 
// This function determines the radius of the earthquake marker based on its magnitude.  
function getRadius(magnitude){
    return magnitude * 4;
}
// This function determines the color of the marker based on the depth of the earthquake.
function getColor(depth){
    if (depth > 90) {
        return "rgb(197, 60, 56)";
    } else if (depth > 70) {
        return "rgb(255, 140, 0)";
    } else if (depth > 50) {
        return "rgb(243, 181, 47)";
    } else if (depth > 30) {
        return "rgb(233, 223, 81)";
    } else if (depth > 10) {
        return "rgb(128, 197, 49)";
    }else {
        return "rgb(45, 160, 16)";
    }
}
 
// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
  data.features.forEach(function(quake) {
    // obtain the coordinates, depth, magnitude and location of each earthquake    
    let lat = quake.geometry.coordinates[1];
    let lon = quake.geometry.coordinates[0];
    let depth = quake.geometry.coordinates[2];
    let magnitude = quake.properties.mag;
    let place = quake.properties.place;
    // generate marker based on relevant earthquake data and add to map
    let marker = L.circleMarker([lat, lon], {
        radius: getRadius(magnitude),
        color: getColor(depth),
        fillOpacity: 1
    }).addTo(myMap);
    // add popup containing magnitude, location and depth
    marker.bindPopup(`<b>Magnitude:</b> ${magnitude}<br><b>Location:</b> ${place}<br><b>Depth:</b> ${depth}`);
 })
 
// Create a legend control object.
let legend = L.control({
   position: "bottomright"
});
// Then add all the details for the legend
legend.onAdd = function () {
  let div = L.DomUtil.create("div", "info legend");

    // Initialize depth intervals and colors for the legend
    let depths = [-10, 10, 30, 50, 70, 90]
    let colors = ["rgb(45, 160, 16)", "rgb(128, 197, 49)", "rgb(233, 223, 81)", "rgb(243, 181, 47)", "rgb(255, 140, 0)", "rgb(197, 60, 56)"]

    // Loop through our depth intervals to generate a label with a colored square for each interval.
    // template taken from https://leafletjs.com/examples/choropleth/
    for (let i = 0; i<depths.length; i++){
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> " + depths[i] + (depths[i+1]?"&ndash;"+ depths[i+1]+"<br>": "+") 
    }
    return div;
  };
// Finally, add the legend to the map.
legend.addTo(myMap)
});

