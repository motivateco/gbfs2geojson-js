var request = require('request');

module.exports = {

  featureFromProperties: function(feature, featureProperties) {

    // if alert.station_ids
    if (featureProperties.station_ids) {
      featureProperties.station_ids.forEach(function(station_id){
        if (!feature[station_id]) {
          feature[station_id]={
            properties: {}
          }
        };
        
        module.exports.updateFeature(feature, station_id, featureProperties);
      });
    }
    // if station
    else if (featureProperties.station_id) {
      if (!feature[featureProperties.station_id]) {
        feature[featureProperties.station_id] = {
          properties: {}
        }
      };
      module.exports.updateFeature(feature, featureProperties.station_id, featureProperties);

    }
  },

  updateFeature: function(feature, station_id, feature_properties) {

    for(var key in feature_properties) {
      if(feature_properties.hasOwnProperty(key)) {
        feature[station_id].properties[key] = feature_properties[key];
      }
    }
  },

  featureFromInformation: function(feature, station) {
    module.exports.featureFromProperties(feature, station);
    feature[station.station_id].type = "Feature";
    feature[station.station_id].geometry = {
      type: 'Point',
      coordinates: [
        station.lat,
        station.lon
      ]
    };
  },

  getStationStatus: function(feature, url, callback) {

    request({
      url: url,
      json: true
    }, function(error, response, data) {
      
      var stations = data.data.stations;

      for (var stationIndex in stations) {
        var stationProperties = stations[stationIndex];
        module.exports.featureFromProperties(feature, stationProperties);
      }
      
      callback(feature);

    });
  },

  getSystemAlerts: function(feature, url, callback) {
    // Get system alerts asynchronously
    request({
      url: url,
      json: true
    }, function(error, response, data) {
      var alerts = data.data.alerts;

      for (var alertIndex in alerts) {
        var alertProperties = alerts[alertIndex];
        module.exports.featureFromProperties(feature, alertProperties);
      }

      callback(feature);

    });
  },

  getStationInformation: function(feature, url, callback) {
    // Get station information asynchronously. This contains geog info, so that is inserted here too
    request({
      url: url,
      json: true
    }, function(error, response, data) {
      var stations = data.data.stations;

      for (var stationIndex in stations) {
        var stationProperties = stations[stationIndex];
        module.exports.featureFromInformation(feature, stationProperties);
      }

      callback(feature);

    });
  },

  getAllData: function(jsonURL, data, callback) {

    request({
          url: jsonURL,
          json: true
        }, function(error, response, data) {

          var feeds = data.data.en.feeds;

          for (var feed in feeds) {
            
            if (feeds[feed].name == "station_information") {
              var stationInformationUrl = feeds[feed].url;
            }
            
            if (feeds[feed].name == "station_status") {
              var stationStatusUrl = feeds[feed].url;
            }
            
            if (feeds[feed].name == "system_alerts") {
              var systemAlertsUrl = feeds[feed].url;
            }
          }

          module.exports.getStationInformation(data, stationInformationUrl,
            function(data) {

              module.exports.getStationStatus(data, stationStatusUrl,
                function(data) {

                  module.exports.getSystemAlerts(data, systemAlertsUrl,
                    function(data) {

                      callback(data);
                    });
                });
            });

        });
  },

  getStatusAndAlerts: function(stationStatusUrl, systemAlertsUrl, data, callback) {

    module.exports.getStationStatus(data, stationStatusUrl,
      function(data) {

        module.exports.getSystemAlerts(data, systemAlertsUrl,
          function(data) {

            callback(data);
          });
      });
  }

}