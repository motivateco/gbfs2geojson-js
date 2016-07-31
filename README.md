# gbfs2geojson-js
NPM module to help with easy GBFS feed integration.

Usage

var gbfs2geoJSON = require('gbfs2geoJSON-js');

// auto-discovery URLs for all NABSA bikeshares are found at:
// https://github.com/NABSA/gbfs/blob/master/systems.csv
var autoDiscoveryUrl = "https://gbfs.citibikenyc.com/gbfs/gbfs.json";

var data = {}

gbfs2geoJSON.getAllData(autoDiscoveryUrl, data, function(data, err) {
  if (err) {
    console.log(err);
  }
  console.log(data);
});


featureFromProperties:
   * Converts station_status and system_alerts GBFS data to geoJSON format
   *
   * @param  {Object} feature: initial object to populate with geoJSON data
   * @param  {Object} feature_properties: object holding station property information
