# Leaflet-Challenge

## Task

### Earthquake Visualization

My task was to visualize an earthquake data set.

1. **Data set**

   The USGS provides earthquake data in a number of different formats, updated every 5 minutes. I chose the json data set that reports all earthquakes in the past 7 days. 

2. **Import & Visualize the Data**

   I created a map using Leaflet.js that plots all of the earthquakes from this data set based on their longitude and latitude.

   The data markers reflect the magnitude of the earthquake by their size and and depth of the earth quake by color. Earthquakes with higher magnitudes appear larger and earthquakes with greater depth appear darker in color.

   I also include popups that provide additional information about the earthquake when a marker is clicked. The popups provide the location of the earthquake, as well as its magnitude.

   I created a legend that will provides context for the map data.

   Along with the visualizations for locations and magnitudes of earthquakes, I also included a map layer that represents tectonic plate locations. This helps to visualize how tectonic plate location correlates with earthquake occurence.

   I included layer controls to my map that allow the user to choose between a number of base maps and a number of overlays, which can be turned on and off independently. 

