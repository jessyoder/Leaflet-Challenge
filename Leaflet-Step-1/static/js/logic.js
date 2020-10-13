var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url, function(data) { 
  console.log(data.features)
  createFeatures(data.features); 
});

function getColor(d) {
  return d > 1000 ? '#800026' :
         d > 500  ? '#BD0026' :
         d > 200  ? '#E31A1C' :
         d > 100  ? '#FC4E2A' :
         d > 50   ? '#FD8D3C' :
         d > 20   ? '#FEB24C' :
         d > 10   ? '#FED976' :
                    '#FFEDA0';
};

function markerSize(radius) {
  return radius * 25000;
};

function createFeatures(earthquakeData) {
  var earthquakes = L.geoJSON(earthquakeData, {
  
  onEachFeature : function (feature, layer) {

    // Give each feature a popup describing the place and magnitude
    layer.bindPopup('<h4>Location: ' + feature.properties.place + '</h4><hr><h4>Magnitude: ' + feature.properties.mag + '</h4>')},
    
    // Give each circle size and color based on magnitude
    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: markerSize(feature.properties.mag),
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

  var baseMaps = {
    "Dark Map": darkmap,
    "Satellite Map": satmap,
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  }

  var myMap = L.map("mapid", {
    center: [34.156113, -118.131943],
    zoom: 3,
    layers: [darkmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 1, 2, 3, 4, 5],
          labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
  };

  legend.addTo(myMap);
}
}