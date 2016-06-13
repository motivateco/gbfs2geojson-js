/**
 * gbfsMapboxParser makes ajax calls for three JSON files, places them into a feature object
 * which can be easily converted into geoJSON or iterated over to add to a map.
 */

function featureFromProperties(feature, featureProperties) {

  // if alert.station_ids
  if (featureProperties.station_ids) {
    featureProperties.station_ids.forEach(function(station_id){
      if (!feature[station_id]) {
        feature[station_id]={
          properties: {}
        }
      };
      
      updateFeature(feature, station_id, featureProperties);
    });
  }
  // if station
  else if (featureProperties.station_id) {
    if (!feature[featureProperties.station_id]) {
      feature[featureProperties.station_id] = {
        properties: {}
      }
    };
    updateFeature(feature, featureProperties.station_id, featureProperties);

  }
}

function updateFeature(feature, station_id, feature_properties) {
  feature[station_id].properties = $.extend(feature[station_id].properties, feature_properties);
}

function featureFromInformation(feature, station) {
  featureFromProperties(feature, station);
  feature[station.station_id].type = "Feature";
  feature[station.station_id].geometry = {
    type: 'Point',
    coordinates: [
      station.lat,
      station.lon
    ]
  };
  // sessionStorage.featureWithStationInfo[station.station_id] = JSON.stringify(feature[station.station_id]);
  // var tempJSONholder = JSON.parse(sessionStorage.featureWithStationInfo);
  // tempJSONholder[station.station_id] = JSON.stringify(feature[station.station_id]);
  // sessionStorage.featureWithStationInfo = JSON.stringify(tempJSONholder);
}

function getStationStatus(feature, url) {

  $.getJSON(url, function(data, statusText) {
    
    var stations = data.data.stations;

    // stations.forEach(featureFromProperties);

    for (var stationIndex in stations) {
      var stationProperties = stations[stationIndex];
      featureFromProperties(feature, stationProperties);
    }
    
  });
}

function getSystemAlerts(feature, url) {
  // Get system alerts asynchronously
  $.getJSON(url, function(data, statusText) {
    var alerts = data.data.alerts;

    // alerts.forEach(featureFromProperties);

    for (var alertIndex in alerts) {
      var alertProperties = alerts[alertIndex];
      featureFromProperties(feature, alertProperties);
    }

  });
}

function getStationInformation(feature, url) {
  // Get station information asynchronously. This contains geog info, so that is inserted here too
  $.getJSON(url, function(data, statusText) {
    var stations = data.data.stations;

    sessionStorage.setItem("featureWithStationInfo", JSON.stringify({}));
    // stations.forEach(featureFromInformation);

    for (var stationIndex in stations) {
      var stationProperties = stations[stationIndex];
      featureFromInformation(feature, stationProperties);
    }

  });
}

var gbfsMapboxParser = function() {
  // list of stations indexed by station_id, organized like the JSON feature object
  
    // console.log(sessionStorage.getItem("feature"));
  if (sessionStorage.getItem("feature") == null) {
    sessionStorage.setItem("feature", JSON.stringify({}));
    var feature = JSON.parse(sessionStorage.getItem("feature"));
    getStationInformation(feature, 'http://api-core.citibikenyc.com/gbfs/en/station_information.json');
  }
  else {
    var feature = JSON.parse(sessionStorage.getItem("feature"));
  }


  getStationStatus(feature, 'http://api-core.citibikenyc.com/gbfs/en/station_status.json');

  getSystemAlerts(feature, 'http://api-core.citibikenyc.com/gbfs/en/system_alerts.json');

  // After ajax completion
  $(document).on("ajaxStop", function() {
    sessionStorage.setItem("feature", JSON.stringify(feature));
    // remove any pins on the pin layer
    pinLayer.clearLayers();
    
    /**
     * Determine which icon a station needs based on various criteria
     * @param {station} - The station obejct which an icon is needed for 
     * @return {L.divIcon} - required divicon.
     */
    var getIcon = function(obj) {
      // Determine the fraction of bikes availible in increments of 10, from 0 to 100.
      var bikeFrac = ((obj.properties["num_bikes_available"] / obj.properties.capacity) * 10);
      var bikePctg = (Math.round(bikeFrac) * 10 || 0);
      // If zoom is > 13, show pins, otherwise show dots
      if (map.getZoom() > 13) {
        // Valet
        if (obj.properties.summary == "Valet service available") {return valetPin;}
        if (obj.properties.is_renting == 0) { // Deactive
          return greyPin;
        } else if (bikePctg > 30) { // Medium
          return mode == "bike" ? greenPin : redPin
        } else if (bikePctg > 10) { // Low
          return yellowPin; 
        } else { // Full
          return mode == "bike" ? redPin : greenPin
        }
      } else {
        if (obj.properties.is_renting == 0) { // Deactive
          return greyDot;
        } else if (bikePctg > 30) { //Medium
          return mode == "bike" ? greenDot : redDot
        } else if (bikePctg > 10) { // Low
          return yellowDot;
        } else { // Full
          return mode == "bike" ? redDot : greenDot
        }
      }
    }
    
    /**
     * Function to be called in a non-blocking context which will add a marker to the pinLayer
     * and add the pinLayer to the map.
     * @param {station} stationObject - station to be added.
     */
    var addMarker = function(obj) {
      var popupContent = '<h3>' + obj.properties['name'] + '</h3><p> Bikes: ' + obj.properties['num_bikes_available'] + ' | Docks: ' + obj.properties['num_docks_available'] + '</p>';
      L.marker(obj.geometry.coordinates, {
          icon: getIcon(obj),
          title: obj.properties['name'],
        })
        .bindPopup(popupContent, {
          closeButton: false
        })
        .addTo(pinLayer);
      setTimeout(function() {
        pinLayer.addTo(map)
      }, 0); // add it to the map!
    }
    for (var obj in feature) {
      setTimeout(addMarker(feature[obj]), 0);
    }
  });
}