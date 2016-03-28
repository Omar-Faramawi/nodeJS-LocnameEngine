var Location = require("../../Models/Location");
var OpenStreetMapper = require("./OpenStreetMapper");

var geocoderProvider = 'openstreetmap';
var geocoder = require('node-geocoder')(geocoderProvider);
var LocationManager = require('../../Models/LocationManager');
var QueryManger = require('../../Models/QueryManager');
var async = require('async');

var OpenStreetSource = (function () {
    function OpenStreetSource() {
        this.name = "openstreetmap";
    }
    OpenStreetSource.prototype.map = function (orignal) {
        var target = new Location();
        ;
        var OSMMapper = new OpenStreetMapper();
        var result = OSMMapper.map(orignal, target);

        return result;
    };

    OpenStreetSource.prototype.searchAddress = function (address, Callback) {
        var result = [];
        var that = this;
        var arrayOfLocationsIds = [];
        geocoder.geocode(address, function (err, data) {
            var LocationManagerObj = new LocationManager();

            function saveLocation(object) {
                return function (cb) {
                    LocationManagerObj.saveLocations(object, that, function (data) {
                        cb && cb(null, data);
                    });
                };
            }
            var functions = new Array();
            for (var obj in data) {
                var thisResultObj = data[obj];
                var fun = saveLocation(thisResultObj);
                functions.push(fun);
            }

            async.parallel(functions, function (err, res) {
                for (var obj in res) {
                    result.push(res[obj].Location);
                    arrayOfLocationsIds.push(res[obj].LocationID);
                }

                console.log("Open Street Text search");
                var QueryMangerobj = new QueryManger();
                QueryMangerobj.saveQuery(address, arrayOfLocationsIds);
                Callback && Callback(result);
            });
        });
    };

    OpenStreetSource.prototype.searchGeo = function (geo, Callback) {
        //Convert geometry to array
        var geometry = geo.location.split(',');

        var result = [];
        var that = this;
        var arrayOfLocationsIds = [];

        geocoder.reverse({ lat: geometry[0], lon: geometry[1] }, function (err, data) {
            var LocationManagerObj = new LocationManager();

            function saveLocation(object) {
                return function (cb) {
                    LocationManagerObj.saveLocations(object, that, function (data) {
                        cb && cb(null, data);
                    });
                };
            }
            var functions = new Array();
            for (var obj in data) {
                var thisResultObj = data[obj];
                var fun = saveLocation(thisResultObj);
                functions.push(fun);
            }

            async.parallel(functions, function (err, res) {
                for (var obj in res) {
                    result.push(res[obj].Location);
                    arrayOfLocationsIds.push(res[obj].LocationID);
                }

                console.log("Open Street Text search");
                var QueryMangerobj = new QueryManger();
                QueryMangerobj.saveQuery(geo.location, arrayOfLocationsIds);
                Callback && Callback(result);
            });
        });
    };
    return OpenStreetSource;
})();

module.exports = OpenStreetSource;
//# sourceMappingURL=OpenStreetSource.js.map
