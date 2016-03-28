var CacheManager = require('./CacheManager');
var LocationsModel = require('../../models/Locations');
var LocationData = LocationsModel.Model;
var LocationManager = (function () {
    function LocationManager() {
    }
    LocationManager.prototype.saveLocations = function (original, source, callback) {
        var edited = false;
        var cacheManagerObj = new CacheManager();
        var that = this;
        var object;
        var mappedLocation;
        if (original.cacheId) {
            mappedLocation = original;
            edited = true;
            LocationData.create({
                description: mappedLocation.description,
                address_components: mappedLocation.address_components,
                formatted_address: mappedLocation.formatted_address,
                geometry: mappedLocation.geometry,
                source: mappedLocation.source,
                cacheId: original.cacheId,
                edited: edited,
                select_count: 0
            }, function (err, success) {
                if (err) {
                    console.log("Location saving failed");
                }
                else {
                    object = {
                        Location: success,
                        LocationID: success._id
                    };
                    callback && callback(object);
                }
            });
        }
        else {
            cacheManagerObj.saveOriginal(original, source, function (data) {
                var sourceId = data;
                mappedLocation = source.map(original);
                if (sourceId) {
                    LocationData.create({
                        description: mappedLocation.description,
                        address_components: mappedLocation.address_components,
                        formatted_address: mappedLocation.formatted_address,
                        geometry: mappedLocation.geometry,
                        source: mappedLocation.source,
                        cacheId: sourceId,
                        edited: edited,
                        select_count: 0
                    }, function (err, success) {
                        if (err) {
                            console.log("Location saving failed");
                        }
                        else {
                            object = {
                                Location: success,
                                LocationID: success._id
                            };
                            callback && callback(object);
                        }
                    });
                }
                else {
                    if (original.place_id == undefined) {
                        sourceId = original.id + "." + source.name;
                    }
                    else {
                        sourceId = original.place_id + "." + source.name;
                    }
                    LocationData.find({ cacheId: sourceId }, function (err, res) {
                        if (res.length != 0) {
                            console.log("saving : ", res[0]);
                            object = {
                                Location: res[0],
                                LocationID: res[0]._id
                            };
                            callback && callback(object);
                        }
                    });
                }
            });
        }
    };
    return LocationManager;
})();
module.exports = LocationManager;
