var request = require('request');

module.exports = {

  /**
   * Converts station_status and system_alerts GBFS data to geoJSON format
   *
   * @param  {Object} feature: initial object to populate with geoJSON data
   * @param  {Object} feature_properties: object holding station property information
  */
  featureFromProperties: function(feature, featureProperties) {

    // if alert.station_ids
    if (featureProperties.station_ids) {
      featureProperties.station_ids.forEach( function(station_id){
        if (!feature[station_id]) {
          feature[station_id]={
            properties: {}
          }
        };
        
        module.exports.updateFeature(feature, station_id, featureProperties);
      });
    }

    // if station
    else if (featureProperties.station_id && !feature[featureProperties.station_id]) {
      feature[featureProperties.station_id] = {
        properties: {}
      }
    };

    module.exports.updateFeature(feature, featureProperties.station_id, featureProperties);

  },

  /**
   * Adds properties to feature
   *
   * @param  {Object} feature: initial object to populate with geoJSON data
   * @param  {String} station_id: station ID
   * @param  {Object} feature_properties: object holding station property information
  */
  updateFeature: function(feature, station_id, feature_properties) {

    for(var key in feature_properties) {
      if(feature_properties.hasOwnProperty(key)) {
        feature[station_id].properties[key] = feature_properties[key];
      }
    }
  },

  /**
   * Converts station_information GBFS data to geoJSON format
   *
   * @param  {Object} feature: initial object to populate with geoJSON data
   * @param  {Object} stationProperties: object holding station property information
  */
  featureFromInformation: function(feature, stationProperties) {
    module.exports.featureFromProperties(feature, stationProperties);
    feature[stationProperties.station_id].type = "Feature";
    feature[stationProperties.station_id].geometry = {
      type: 'Point',
      coordinates: [
        stationProperties.lat,
        stationProperties.lon
      ]
    };
  },

  /**
   * Get geoJSON for data from station_status
   *
   * @param  {Object} feature: initial object to populate with geoJSON data
   * @param  {String} , url: URL for station_information GBFS feed
   * @param  {Function} callback: function to call when the request is complete.
  */
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


  /**
   * Get geoJSON for data from system_alerts
   *
   * @param  {Object} feature: initial object to populate with geoJSON data
   * @param  {String} , url: URL for station_information GBFS feed
   * @param  {Function} callback: function to call when the request is complete.
  */
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

  /**
   * Get geoJSON for data from station_information
   *
   * @param  {Object} feature: initial object to populate with geoJSON data
   * @param  {String} , url: URL for station_information GBFS feed
   * @param  {Function} callback: function to call when the request is complete.
  */
  getStationInformation: function(feature, url, callback) {
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

  /**
   * Get geoJSON for data from station_information, station_status, and system_alerts
   *
   * @param  {String} url: auto-discovery URL for city GBFS feed
   * @param  {Object} feature: initial object to populate with geoJSON data
   * @param  {Function} callback: function to call when the request is complete.
  */
  getAllData: function(url, feature, callback) {

    request({
          url: url,
          json: true
        }, function(error, response, feature) {

            if (error != null) {
              callback({}, error);
              return
            }

            var feeds = feature["data"]["en"]["feeds"]; 

            var stationInformationUrl;
            var stationStatusUrl;
            var systemAlertsUrl;

            feeds.forEach( function(feed) {
              
              switch(feed.name) {

                case "station_information":
                  stationInformationUrl = feed.url;

                case "station_status":
                  stationStatusUrl = feed.url;

                case "system_alerts":
                  systemAlertsUrl = feed.url;

              }

            });

            // checking for all three json feeds
            if (!stationInformationUrl) {
              callback({}, "No station_information json found");
            }

            if (!stationStatusUrl) {
              callback({}, "No station_status json found");
            }

            module.exports.getStationInformation(feature, stationInformationUrl, function(feature) {

              if (systemAlertsUrl) {
                module.exports.getStatusAndAlerts(stationStatusUrl, systemAlertsUrl, feature, callback);
              }
              else {
                module.exports.getStatusAndAlerts(stationStatusUrl, null, feature, callback); 
              }
            });

        });
  },


  /**
   * Get geoJSON for data from station_status and system_alerts
   *
   * @param  {String} stationStatusUrl: URL for station_status GBFS feed
   * @param  {String} systemAlertsUrl: URL for system_alerts GBFS feed
   * @param  {Object} feature: initial object to populate with geoJSON data
   * @param  {Function} callback: function to call when the request is complete.
  */
  getStatusAndAlerts: function(stationStatusUrl, systemAlertsUrl, feature, callback) {

    module.exports.getStationStatus(feature, stationStatusUrl,
      function(feature) {

        if (systemAlertsUrl != null) {
          module.exports.getSystemAlerts(feature, systemAlertsUrl,
            function(feature) {

              callback(feature);
            });
        }
        else {
          callback(feature);
        }
      });
  }

}