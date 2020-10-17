// Store API endpoint inside url variable
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(url, function(data) { 
  createFeatures(data.features); 
});

// Create a function that returns a color based on earthquake depth
function getColor(d) {
  switch(true) {
    case d > 5:
      return '#BD0026';
    case d > 4:
      return '#E31A1C';
    case d > 3:
      return '#FC4E2A';
    case d > 2:
      return '#FEB24C';
    case d > 1:
      return '#FED976';
    default:
      return '#FFEDA0';
  }
}

// Create a function that gathers earthquake magnitude
function getRadius(radius) {
  return radius * 25000;
};

// Define a function to run once for each feature in the features array
function createFeatures(earthquakeData) {
  var earthquakes = L.geoJSON(earthquakeData, {
  
  onEachFeature : function (feature, layer) {

    // Give each feature a popup describing the place and magnitude
    layer.bindPopup('<h4>Location: ' + feature.properties.place + '</h4><hr><h4>Magnitude: ' + feature.properties.mag + '</h4>')},
    
    // Give each circle size and color based on magnitude
    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: 'black',
        fillOpacity: 0.75,
        stroke: false
      })
  }
})

// Sending our earthquakes layer to the createMap function
createMap(earthquakes)

function createMap(earthquakes) {

  // Create the tile layer that will be the background of the map
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      maxZoom: 18,
      id: "satellite-v9",
      accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Dark Map": darkmap,
    "Satellite Map": satmap,
  };

  // Create a variable with tectonic plates data
  var tectonicPlates = new L.LayerGroup();
  
  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  }

  // Create the map, giving it the darkmap and earthquakes layers to display on load
  var myMap = L.map("mapid", {
    center: [34.0133, -6.8326],
    zoom: 3,
    layers: [darkmap, earthquakes, tectonicPlates]
  });

  // Create a layer control, pass in our baseMaps and overlayMaps, add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Create a legend 
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {

      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 1, 2, 3, 4, 5],
          labels = [];

      // loop through our intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
  };

  // Add legend to the map
  legend.addTo(myMap);
}
}