if (!navigator.geolocation) {
  console.error("Geolocation is not available on this browser");
}
else {
  console.log('bruh');
  document.getElementById("geolocation").onclick = function(e) {
    map.locate();
  };
};

function setMapLocation(e) {
  map.fitBounds(e.bounds);
  var geoLocJSON = [{
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [e.latlng.lng, e.latlng.lat]
    },
    properties: {
      "title": "Current Location",
      "className": "pin blue"
      // "marker-symbol": "star"
    }
  }];
  L.mapbox.featureLayer().setGeoJSON(geoLocJSON).addTo(map);
}

map.on("locationfound", setMapLocation);