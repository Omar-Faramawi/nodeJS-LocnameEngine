///<reference path="../../../Scripts/googlemaps.d.ts" />
import ISource = require('../Interfaces/ISource');
import Location = require("../../Models/Location");
import Geometry = require('../../Models/Geometry');
import googlemaps = require('googlemaps');
import GoogleMapsSourceMapper = require('./GoogleMapSourceMapper');
import LocationManager = require('../../Models/LocationManager');
import QueryManger = require('../../Models/QueryManager');
import async = require('async');
var algoliasearch = require('algoliasearch');
var client = algoliasearch('UHINAVK196', 'a954843ee1c82df2b231130a7c43ca26');
var index = client.initIndex('locations');

class GoogleMapsSource implements ISource{
    name: String;

    constructor() {
        this.name = "GoogleMapsSource";
    }
    map(orignal: any): Location {

        var target= new Location();
        var googleMapsObj = new GoogleMapsSourceMapper();
        var result = googleMapsObj.map(orignal, target);
        return result;
    }
    searchAddress(address: string, Callback) {
        var result: any[] = [];
        var that = this;
        var arrayOfLocationsIds: any[] = [];

        googlemaps.geocode(address, function (err, data) {
            var LocationManagerObj = new LocationManager();

            function saveLocation(object) {
                return function (cb) {
                    LocationManagerObj.saveLocations(object, that, function (data) {
                        cb && cb(null, data);
                    });
                }
            }
            var functions = new Array<Function>();
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
                for(var i in result)
              		{
              			result[i].objectID=result[i]._id;
              		}
                      index.addObjects(result, function(err, content) {
               	    	index.search(address, function searchDone(err, content) {
                         console.log("algolia accesses");
                        Callback && Callback(content);
                		});

              		});


            });
        } , false, null, "eg", "ar");
    }
    //////////////////////////////////////////////////////////////////////////
    searchGeo(geo: Geometry, Callback) {
        var result: any[] = [];
        var that = this;
        var arrayOfLocationsIds: any[] = [];
        googlemaps.geocode(geo.location, function (err, data) {
            var LocationManagerObj = new LocationManager();

            function saveLocation(object) {
                return function (cb) {
                    LocationManagerObj.saveLocations(object, that, function (data) {
                        cb && cb(null, data);
                    });
                }
            }
            var functions = new Array<Function>();
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
        } , false, null, "eg", "ar");
    }
}
export = GoogleMapsSource;
