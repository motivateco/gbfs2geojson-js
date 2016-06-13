// Querystring params and helpers

/** 
 * Checks if a query string exists in the current URI, and if so,
 * edits it's value given a key. If no param exists, it creates one.
 * @param {string} key - the parameter to change
 * @param {string} value - the value to set the querystirng key to 
 */
var updateQueryStringParam = function(key, value) {
  var rex = new RegExp("([?&])" + key + "=.*?(&|$)", "i")
  var URI = document.location.search;
  var sep = URI.indexOf("?") !== -1 ? "&" : "?";
  if (URI.match(rex)) {
    var newState = URI.replace(rex, "$1" + key + "=" + value + "$2");
    history.pushState(null, "Citibike Station Map", newState);
  } else {
    var newState = URI + sep + key + "=" + value;
    history.pushState(null, "Citibike Station Map", newState)
  }
};

/**
 * Returns a querystring value given a key in the current URI.
 * @param {string} key - the key to look up
 */
function getQueryStringVal(key) {
  URL = window.location.href;
  key = key.replace(/[\[\]]/g, "\\$&");
  var rex = new RegExp("[?&]" + key + "(=([^&#]*)|&|#|$)"),
    res = rex.exec(URL);
  if (!res) return "";
  if (!res[2]) return "";
  return decodeURIComponent(res[2].replace(/\+/g, " "));
}

/**
 * Checks first for querystrings, then for session storage, and
 * sets the map view to the given lat, lon, and zoom level.
 */
if ((getQueryStringVal("lat") != "") && (getQueryStringVal("lon") != "") && (getQueryStringVal("zoom") != "")) {
  map.setView([getQueryStringVal("lat"), getQueryStringVal("lon")], getQueryStringVal("zoom"));
}
else if ((sessionStorage.getItem("lat") != null) && (sessionStorage.getItem("lon") != null) && (sessionStorage.getItem("zoom") != null))
{
  map.setView([sessionStorage.getItem("lat"), sessionStorage.getItem("lon")], sessionStorage.getItem("zoom"));
}
else {
  map.setView([40.7127, -74.0059], 15);
}