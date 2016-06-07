var parseGBFS = function(statusURL, alertURL, infoURL) {
  var json = {
    type: "FeatureCollection",
    features: []
  }
  // list of stations indexed by station_id, organized like the JSON feature object
  var featureObj = {};
    $.ajax(statusURL, function(data, statusText) {
      json1 = false;
      
      var stations = data.data.stations;
      
      for (station in stations) {
        
        if (!featureObj[stations[station].station_id]) {
          featureObj[stations[station].station_id]={
              properties: {}
            }
        };
        
        featureObj[stations[station].station_id].properties = $.extend(featureObj[stations[station].station_id].properties, stations[station]);
      }
      
      json1 = true;
    });

    // Get system alerts asynchronously
    $.getJSON(alertURL, function(data, statusText) {
      json2 = false;
      var alerts = data.data.alerts;
      for (alert in alerts) {
        var alertStations = alerts[alert].station_ids;
        for (station in alertStations) {
          
          if (!featureObj[alertStations[station]]) {
            featureObj[alertStations[station]]={
              properties: {}
            }
          };
          
          featureObj[alertStations[station]].properties = $.extend(featureObj[alertStations[station]].properties, alerts[alert]);
        }
      }
      json2 = true;
    });
    
    // Get station information asynchronously. This contains geog info, so that is inserted here too
    $.getJSON('infoURL', function(data, statusText) {
      json3 = false;
      var stations = data.data.stations;
      for (station in stations) {
        
        if (!featureObj[stations[station].station_id]) {
          featureObj[stations[station].station_id]={
            properties: {}
          }
        };
        
        featureObj[stations[station].station_id].properties = $.extend(featureObj[stations[station].station_id].properties, stations[station]);
        featureObj[stations[station].station_id].type = "Feature";
        featureObj[stations[station].station_id].geometry = {
          type: 'Point',
          coordinates: [
            stations[station].lat,
            stations[station].lon
          ]
        };
      }
      json3 = true;
    });

  // Get station information asynchronously. This contains geog info, so that is inserted here too
  $.getJSON('http://api-core.citibikenyc.com/gbfs/en/station_information.json', function(data, statusText) {
    var stations = data.data.stations;
    for (station in stations) {
      
      // If this is the first function to execute, create the object for the station
      if (!featureObj[stations[station].station_id]) {
        featureObj[stations[station].station_id] = {
          properties: {}
        }
      };
      
      featureObj[stations[station].station_id].properties = $.extend(featureObj[stations[station].station_id].properties, stations[station]);
      
      // Also, add any additional geoJSON required information.
      featureObj[stations[station].station_id].type = "Feature";
      featureObj[stations[station].station_id].geometry = {
        type: 'Point',
        coordinates: [
          stations[station].lat,
          stations[station].lon
        ]
      };
    }
  });

  // After ajax completion
  $(document).on("ajaxStop", function() {
    // remove any pins on the pin layer

    for (obj in featureObj) {
      json.features.push(obj)
    }
    console.log(JSON.stringify(json));
    return json;
  });
}

module.exports = {
  parseGBFS: function(statusURL, alertURL, infoURL){
    parseGBFS(statusURL, alertURL, infoURL)
  },
}