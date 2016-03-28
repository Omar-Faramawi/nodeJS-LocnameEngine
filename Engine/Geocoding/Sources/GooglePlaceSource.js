var Location = require("../../Models/Location");
var GoogleMapsSourceMapper = require('./GoogleMapSourceMapper');
var LocationManager = require('../../Models/LocationManager');
var QueryManger = require('../../Models/QueryManager');
var async = require('async');
var GooglePlaces = require('google-places');
var algoliasearch = require('algoliasearch');
var client = algoliasearch('UQ64MH28TZ', '632ee7791625b3000b4944e4b0a8cf92');
var locations = client.initIndex('locations');
var GooglePlaceSource = (function () {
    function GooglePlaceSource() {
        this.name = "GoogleMapsSource";
    }
    GooglePlaceSource.prototype.map = function (orignal) {
        var target = new Location();
        var googleMapsObj = new GoogleMapsSourceMapper();
        var result = googleMapsObj.map(orignal, target);
        return result;
    };
    GooglePlaceSource.prototype.searchAddress = function (address, Callback) {
        var result = [];
        var that = this;
        var arrayOfLocationsIds = [];
        var places = new GooglePlaces('AIzaSyCCMAeZquyn1k76JH2BWvGmSa88OF5JaEs');
        places.autocomplete({ input: address, language: "ar", location: "30.043387655763834,2031.239060095536843" }, function (err, response) {
            var count = 0;
            var data = { results: [] };
            var success = function (err, respons, loc) {
                data.results[count] = respons.result;
                data.results[count].description = loc.description;
                count++;
                if (response.predictions.length == count) {
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
                        locations.addObjects(result, function (err, content) {
                            console.log("adding :", content);
                            locations.search(address, function searchDone(err, content) {
                                Callback && Callback(content.hits);
                            });
                        });
                    });
                }
            };
            for (var index in response.predictions) {
                var cb = (function (index) {
                    return function (err, res) {
                        success(err, res, response.predictions[index]);
                    };
                })(index);
                places.details({ reference: response.predictions[index].reference, language: "ar" }, cb);
            }
        });
    };
    GooglePlaceSource.prototype.searchGeo = function (geo, Callback) {
    };
    return GooglePlaceSource;
})();
module.exports = GooglePlaceSource;
