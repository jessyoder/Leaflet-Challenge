var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tplates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
d3.json(url, function(data) { 
  // console.log(data.features)
  createFeatures(data.features); 
});

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

function getRadius(radius) {
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

  var baseMaps = {
    "Dark Map": darkmap,
    "Satellite Map": satmap,
  };

  var tectonicPlates = new L.LayerGroup();

  var overlayMaps = {
    Earthquakes: earthquakes,
    "Tectonic Plates":tectonicPlates
  }

  var myMap = L.map("mapid", {
    center: [34.0133, -6.8326],
    zoom: 3,
    layers: [darkmap, earthquakes, tectonicPlates]
  });

  d3.json(tplates, function(pdata) {
    L.geoJson(pdata, {
      color: "blue",
      weight: 2
    })
    .addTo(tectonicPlates);
  })

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {

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