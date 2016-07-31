# gbfs2geojson-js
NPM module to help with easy GBFS feed integration.

## Usage

### Instantiation
```javascript
var gbfs2geoJSON = require('gbfs2geoJSON-js');

// auto-discovery URLs for all NABSA bikeshares are found at:
// https://github.com/NABSA/gbfs/blob/master/systems.csv
var autoDiscoveryUrl = "https://gbfs.citibikenyc.com/gbfs/gbfs.json";

var stationStatusUrl = "https://gbfs.citibikenyc.com/gbfs/en/station_status.json";
var systemAlertsUrl = "https://gbfs.citibikenyc.com/gbfs/en/system_alerts.json";
```

### Convert GBFS data for all feeds into geoJSON
```javascript
var data = {};

gbfs2geoJSON.getAllData(autoDiscoveryUrl, data, function(data, err) {
  if (err) {
    console.log(err);
  }
  console.log(data);
});
```

### Convert GBFS data for Station Information and System Alerts into geoJSON
```javascript
var data = {};

gbfs2geoJSON.getStatusAndAlerts(stationStatusUrl, systemAlertsUrl, data, function(data, err) {
  if (err) {
    console.log(err);
  }
  console.log(data);
});
```
