

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url, function(data){
  console.log(data.features)
  createFeatures(data)
});
    // console.log(data.features)
    // var geometry = data.features[0].geometry;
    // console.log(geometry)
    // var properties = data.features[0].properties;
    // console.log(properties)


function createMap(earthquakes) {
  
  // Create the tile layer that will be the background of the map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  })

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap,
    "Satellite": satellitemap
  };

  // Create an overlayMaps object to hold the earthquakes layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  }

  // Create the map object with options
  var myMap = L.map("mapid", {
    center: [35.546, -77.0525],
    zoom: 3,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);