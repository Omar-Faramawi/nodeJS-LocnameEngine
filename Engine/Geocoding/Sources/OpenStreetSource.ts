import ISource = require('../Interfaces/ISource');
import Location = require("../../Models/Location");
import OpenStreetMapper = require("./OpenStreetMapper");
import Geometry = require('../../Models/Geometry');
var geocoderProvider = 'openstreetmap';
var geocoder = require('node-geocoder')(geocoderProvider);
import LocationManager = require('../../Models/LocationManager');
import QueryManger = require('../../Models/QueryManager');
import async = require('async');


class OpenStreetSource implements ISource {
    name: String;



    constructor() {
        this.name = "openstreetmap";
    }

    map(orignal: any): Location {

        var target = new Location();;
        var OSMMapper = new OpenStreetMapper();
        var result = OSMMapper.map(orignal, target);

        return result;
    }

    searchAddress(address: string, Callback) {

        var result: any[] = [];
        var that = this;
        var arrayOfLocationsIds: any[] = [];
        geocoder.geocode(address, function (err, data) {

            var LocationManagerObj = new LocationManager();

            function saveLocation(object) {
                return function (cb) {
                    LocationManagerObj.saveLocations(object, that, function (data) {
                        cb && cb(null, data);
                    });
                }
            }
            var functions = new Array<Function>();
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
    }

    searchGeo(geo: Geometry, Callback) {

        //Convert geometry to array
        var geometry = geo.location.split(',');

        var result: any[] = [];
        var that = this;
        var arrayOfLocationsIds: any[] = [];
        
        geocoder.reverse({ lat: geometry[0], lon: geometry[1] }, function (err, data) {

            var LocationManagerObj = new LocationManager();

            function saveLocation(object) {
                return function (cb) {
                    LocationManagerObj.saveLocations(object, that, function (data) {
                        cb && cb(null, data);
                    });
                }
            }
            var functions = new Array<Function>();
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
        
    }
  
}


export = OpenStreetSource;
