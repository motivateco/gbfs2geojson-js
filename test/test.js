
var assert = require('chai').assert;
var geoValidate = require("geojson-validation");
var GBFS2GeoJson = require("../index.js")
var jsdom = require('mocha-jsdom')

if (typeof process === 'object') {
  // Initialize node environment
  global.expect = require('chai').expect
  require('mocha-jsdom')()
} else {
  window.expect = window.chai.expect
  window.require = function () { /* noop */ }
}

describe('mocha tests', function () {
 
  var $
 
  before(function () {
    $ = require('zepto')
  })
 
  it('works', function () {
    document.body.innerHTML = '<div>hola</div>'
    expect($("div").html()).eql('hola')
  })
 
})

  
  // // Setup a jsdom env and globally expose window along with other libraries
  // jsdom.env({
  //   html: "<html><body></body></html>",
  //   src: ['https://cdnjs.cloudflare.com/ajax/libs/zepto/1.1.6/zepto.min.js'],
  //   // function (err, window) {
  //     // console.log("contents of a.the-link:", window.$("a.the-link").text());
  //     // describe('GBFS2GeoJson Tests', function() {  
  //     //   describe('CitiBike Test', function () {
  //     //     it('should return valid geojson', function () {
  //     //       console.log(JSON.stringify(GBFS2GeoJson.parseGBFS('https://gbfs.citibikenyc.com/gbfs/en/station_status.json','https://gbfs.citibikenyc.com/gbfs/en/system_alerts.json','https://gbfs.citibikenyc.com/gbfs/en/station_information.json')));
  //     //       
  //     //       assert.equal(-1, [1,2,3].indexOf(5));
  //     //       assert.equal(-1, [1,2,3].indexOf(0));
  //     //     });
  //     //   });
  //     // });
  //   // },
  //   done: function (window) {
  //     window.$  = zepto;
  //     console.log("HN Links");
  //     // $("td.title:not(:last) a").each(function() {
  //     //   console.log(" -", $(this).text());
  //     // });
  //   }
  // });  



