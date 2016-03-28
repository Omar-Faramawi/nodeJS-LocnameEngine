///<reference path="../../../Scripts/googlemaps.d.ts" />
import ISource = require('../Interfaces/ISource');
import Location = require("../../Models/Location");
import Geometry = require('../../Models/Geometry');
import googlemaps = require('googlemaps');
import GoogleMapsSourceMapper = require('./GoogleMapSourceMapper');
import GoogleMapsSource = require('./GoogleMapsSource');
import LocationManager = require('../../Models/LocationManager');
import QueryManger = require('../../Models/QueryManager');
import LocationsModel = require('../../../models/Locations');
import LocationData = LocationsModel.Model;


class EdittedLocationSource {
    saveEditted(query: string, location: any,cb) {
        var arrayOfLocationsIds: any[] = [];
        var LocationManagerObj = new LocationManager();
        var QueryMangerobj = new QueryManger();
        var that = new GoogleMapsSource();
        if (location.status && location.status == "SS" && location.cacheId) {
            LocationData.update({ cacheId: location.cacheId }, { $inc: { select_count: 1 } }, function (err, affectedRows, raw) {
                console.log(err);
            });
        }
        else if (location.status && location.status == "SES" && location.cacheId) {
            LocationData.update({ cacheId: location.cacheId }, { $inc: { select_count: 1 } }, function (err, affectedRows, raw) {
                console.log(err);
            });
            LocationManagerObj.saveLocations(location, that, function (data) {
                arrayOfLocationsIds.push(data.LocationID);
                QueryMangerobj.saveQuery(query, arrayOfLocationsIds);
                cb && cb(true);
            });
        }
        else
            LocationManagerObj.saveLocations(location, that, function (data) {
                arrayOfLocationsIds.push(data.LocationID);
                QueryMangerobj.saveQuery(query, arrayOfLocationsIds);
                cb && cb(true);
            });
        

    }
}   
export = EdittedLocationSource;