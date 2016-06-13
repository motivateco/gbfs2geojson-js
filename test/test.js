
describe("global.js", function () {

  it("Mapbox instantiated", function() {
    expect(L.mapbox.accessToken).to.not.equal(null);;
  });

  it("All divIcons instantiated", function () {
    expect(valetPin).to.not.equal(null);
    expect(greenPin).to.not.equal(null);
    expect(yellowPin).to.not.equal(null);
    expect(redPin).to.not.equal(null);
    expect(greyPin).to.not.equal(null);
    expect(greenDot).to.not.equal(null);
    expect(yellowDot).to.not.equal(null);
    expect(redDot).to.not.equal(null);
    expect(greyDot).to.not.equal(null);
  });

});

// describe("geolocation.js") can't test without mapbox event

describe("mapboxInit.js", function() {

  it("sessionStorage saved", function() {
    expect(sessionStorage.lat).to.not.equal(null);
    expect(sessionStorage.lon).to.not.equal(null);
    expect(sessionStorage.zoom).to.not.equal(null);
  });

});

describe("mapping.js", function() {
  var feature = {};

  it("gbfsMapboxParser", function() {
    expect(getStationStatus(feature, 'http://api-core.citibikenyc.com/gbfs/en/station_status.json')).to.equal(true);
    expect(getSystemAlerts(feature, 'http://api-core.citibikenyc.com/gbfs/en/system_alerts.json')).to.equal(true);
    expect(getStationInformation(feature, 'http://api-core.citibikenyc.com/gbfs/en/station_information.json')).to.equal(true);
  });
})

describe('Compare Numbers', function() {
  it('1 should equal 1', function() {
    expect(1).to.equal(1);
  });
});