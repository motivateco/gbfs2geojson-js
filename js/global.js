// global variables

// MapBox access token
L.mapbox.accessToken = "pk.eyJ1IjoiYWZpc2NoZXIxNSIsImEiOiJjaW92bW00dzIwMWVjdWNtODcya2ZhNzd0In0.VeJ0LvaAnlhsGSSNSktvXw";

// MapBox zoom level
var lastZoom;

// bike/dock mode
var mode = "bike";

// PIN OBJECTS
var valetPin = L.divIcon({
  className: 'pin green valet',
  iconAnchor: [15, 25],
  iconSize: [30, 30]
});

var greenPin = L.divIcon({
  className: 'pin green ' + mode,
  iconAnchor: [15, 25],
  iconSize: [30, 30]
});

var yellowPin = L.divIcon({
  className: 'pin yellow ' + mode,
  iconAnchor: [15, 25],
  iconSize: [30, 30]
});

var redPin = L.divIcon({
  className: 'pin red ' + mode,
  iconAnchor: [15, 25],
  iconSize: [30, 30]
});

var greyPin = L.divIcon({
  className: 'pin grey ' + mode,
  iconAnchor: [15, 25],
  iconSize: [30, 30]
});

var greenDot = L.divIcon({
  className: 'dot green',
  iconAnchor: [0, 0],
  iconSize: [4, 4]
});

var yellowDot = L.divIcon({
  className: 'dot yellow',
  iconAnchor: [0, 0],
  iconSize: [4, 4]
});

var redDot = L.divIcon({
  className: 'dot red',
  iconAnchor: [0, 0],
  iconSize: [4, 4]
});

var greyDot = L.divIcon({
  className: 'dot grey',
  iconAnchor: [0, 0],
  iconSize: [4, 4]
});