var Location = require("../../Models/Location");
var googlemaps = require('googlemaps');
var GoogleMapsSourceMapper = require('./GoogleMapSourceMapper');
var LocationManager = require('../../Models/LocationManager');
var QueryManger = require('../../Models/QueryManager');
var async = require('async');
var algoliasearch = require('algoliasearch');
var client = algoliasearch('UHINAVK196', 'a954843ee1c82df2b231130a7c43ca26');
var index = client.initIndex('locations');
var GoogleMapsSource = (function () {
    function GoogleMapsSource() {
        this.name = "GoogleMapsSource";
    }
    GoogleMapsSource.prototype.map = function (orignal) {
        var target = new Location();
        var googleMapsObj = new GoogleMapsSourceMapper();
        var result = googleMapsObj.map(orignal, target);
        return result;
    };
    GoogleMapsSource.prototype.searchAddress = function (address, Callback) {
        var result = [];
        var that = this;
        var arrayOfLocationsIds = [];
        googlemaps.geocode(address, function (err, data) {
            var LocationManagerObj = new LocationManager();
            function saveLocation(object) {
                return function (cb) {
                    LocationManagerObj.saveLocations(object, that, function (data) {
                        cb && cb(null, data);
                    });
                };
            }
            var functions = new Array();
            for (var obj in data.results) {
                var thisResultObj = data.results[obj];
                var fun = saveLocation(thisResultObj);
                functions.push(fun);
            }
            async.parallel(functions, function (err, res) {
                for (var obj in res) {
                    result.push(res[obj].Location);
                    arrayOfLocationsIds.push(res[obj].LocationID);
                }
                console.log("Google maps Text search");
                var QueryMangerobj = new QueryManger();
                QueryMangerobj.saveQuery(address, arrayOfLocationsIds);
                for (var i in result) {
                    result[i].objectID = result[i]._id;
                }
                index.addObjects(result, function (err, content) {
                    index.search(address, function searchDone(err, content) {
                        console.log("algolia accesses");
                        Callback && Callback(content);
                    });
                });
            });
        }, false, null, "eg", "ar");
    };
    GoogleMapsSource.prototype.searchGeo = function (geo, Callback) {
        var result = [];
        var that = this;
        var arrayOfLocationsIds = [];
        googlemaps.geocode(geo.location, function (err, data) {
            var LocationManagerObj = new LocationManager();
            function saveLocation(object) {
                return function (cb) {
                    LocationManagerObj.saveLocations(object, that, function (data) {
                        cb && cb(null, data);
                    });
                };
            }
            var functions = new Array();
            for (var obj in data.results) {
                var thisResultObj = data.results[obj];
                var fun = saveLocation(thisResultObj);
                functions.push(fun);
            }
            async.parallel(functions, function (err, res) {
                for (var obj in res) {
                    result.push(res[obj].Location);
                    arrayOfLocationsIds.push(res[obj].LocationID);
                }
                console.log("Google maps Text search");
                var QueryMangerobj = new QueryManger();
                QueryMangerobj.saveQuery(geo.location, arrayOfLocationsIds);
                Callback && Callback(result);
            });
        }, false, null, "eg", "ar");
    };
    return GoogleMapsSource;
})();
module.exports = GoogleMapsSource;
