var GoogleMapsSource = require('./GoogleMapsSource');
var LocationManager = require('../../Models/LocationManager');
var QueryManger = require('../../Models/QueryManager');
var LocationsModel = require('../../../models/Locations');
var LocationData = LocationsModel.Model;

var EdittedLocationSource = (function () {
    function EdittedLocationSource() {
    }
    EdittedLocationSource.prototype.saveEditted = function (query, location, cb) {
        var arrayOfLocationsIds = [];
        var LocationManagerObj = new LocationManager();
        var QueryMangerobj = new QueryManger();
        var that = new GoogleMapsSource();
        if (location.status && location.status == "SS" && location.cacheId) {
            LocationData.update({ cacheId: location.cacheId }, { $inc: { select_count: 1 } }, function (err, affectedRows, raw) {
                console.log(err);
            });
        } else if (location.status && location.status == "SES" && location.cacheId) {
            LocationData.update({ cacheId: location.cacheId }, { $inc: { select_count: 1 } }, function (err, affectedRows, raw) {
                console.log(err);
            });
            LocationManagerObj.saveLocations(location, that, function (data) {
                arrayOfLocationsIds.push(data.LocationID);
                QueryMangerobj.saveQuery(query, arrayOfLocationsIds);
                cb && cb(true);
            });
        } else
            LocationManagerObj.saveLocations(location, that, function (data) {
                arrayOfLocationsIds.push(data.LocationID);
                QueryMangerobj.saveQuery(query, arrayOfLocationsIds);
                cb && cb(true);
            });
    };
    return EdittedLocationSource;
})();
module.exports = EdittedLocationSource;
//# sourceMappingURL=EdittedLocationSource.js.map
