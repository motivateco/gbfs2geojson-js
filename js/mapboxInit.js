// MapBox and DOM initialization functions

// map boundaries set at Sayreville, NJ and Larchmont, NY
var southWest = L.latLng(40.496321, -74.308184),
  northEast = L.latLng(40.919472, -73.749974),
  bounds = L.latLngBounds(southWest, northEast);

// tileJSON from MapBox Studio
var tileJSON = {
  "tiles": [ "https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=" + L.mapbox.accessToken ]
};

// map object initialization
var map = L.mapbox.map("map", tileJSON, {
  // set that bounding box as maxBounds to restrict moving the map
  // see full maxBounds documentation:
  // http://leafletjs.com/reference.html#map-maxbounds
  maxBounds: bounds,
  maxZoom: 19,
  minZoom: 12
});

// style layer from MapBox Studio
L.mapbox.styleLayer("mapbox://styles/afischer15/ciovro1tr002eavm6yq0yg7yo").addTo(map);

// pin Feature layer
var pinLayer = L.mapbox.featureLayer();

// on move (when mouse is released)
map.on("moveend", function() {
  var lat = map.getCenter().lat,
    lon = map.getCenter().lng,
    zoom = map.getZoom();

  // saving lat and long in session storage
  sessionStorage.setItem("lat", lat);
  sessionStorage.setItem("lon", lon);
  sessionStorage.setItem("zoom", zoom);
 
  // updating URL query param
  updateQueryStringParam("lat", lat);
  updateQueryStringParam("lon", lon);
  updateQueryStringParam("zoom", zoom);
  lastZoom = map.getZoom();
})

// on map frame load
map.on('ready', gbfsMapboxParser());

// on end of zoom
map.on('zoomend', function(){

  // if all ajax requests are completed
  // CORRECTIONS- USE PROMISES
  // if ($.active() == 0) {

    // if user crosses zoom threshold of 13, reload markers
    if ((lastZoom > 13 && map.getZoom() <= 13) || (lastZoom <= 13 && map.getZoom() > 13)){
      gbfsMapboxParser();
    }
  // };
});

// Bike/Dock Toggle event listener
$("#bikeToggle, #dockToggle").click(function() {

  // sets active class for bike or dock hyperlink
  $("#bikeToggle, #dockToggle").toggleClass("active");

  // toggling for icons
  $('.pin').toggleClass('bike').toggleClass('dock');

  var reds = $('.red');
  // toggling for pins
  $('.green:not(.valet)').toggleClass('red').toggleClass('green');
  reds.toggleClass('green').toggleClass('red');

  // toggle the mode
  mode == "bike" ? mode = "dock" : mode = "bike";
});

// Reload data every 30 seconds
window.setInterval(function() {
  gbfsMapboxParser();
}, 30000);
