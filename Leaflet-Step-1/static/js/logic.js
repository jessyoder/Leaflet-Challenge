var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl, function(data){
    console.log(data.features)
    var geometry = data.features[0].geometry;
    console.log(geometry)
    var properties = data.features[0].properties;
    console.log(properties)
    // createFeatures(data.features)
})




