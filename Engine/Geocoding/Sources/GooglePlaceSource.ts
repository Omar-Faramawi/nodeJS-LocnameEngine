///<reference path="../../../Scripts/googlemaps.d.ts" />
import ISource = require('../Interfaces/ISource');
import Location = require("../../Models/Location");
import Geometry = require('../../Models/Geometry');
import googlemaps = require('googlemaps');
import GoogleMapsSourceMapper = require('./GoogleMapSourceMapper');
import LocationManager = require('../../Models/LocationManager');
import QueryManger = require('../../Models/QueryManager');
import async = require('async');
var GooglePlaces = require('google-places');
var algoliasearch = require('algoliasearch');
var client = algoliasearch('UQ64MH28TZ', '632ee7791625b3000b4944e4b0a8cf92');
var locations = client.initIndex('locations');

class GooglePlaceSource implements ISource {
    name: String;

    constructor() {
        this.name = "GoogleMapsSource";
    }
    map(orignal: any): Location {

        var target = new Location();
        var googleMapsObj = new GoogleMapsSourceMapper();
        var result = googleMapsObj.map(orignal, target);
        return result;
    }
    searchAddress(address: string, Callback) {
            var result: any[] = [];
            var that = this;
            var arrayOfLocationsIds: any[] = [];
        var places = new GooglePlaces('AIzaSyCCMAeZquyn1k76JH2BWvGmSa88OF5JaEs');
        places.autocomplete({ input: address, language: "ar", location:"30.043387655763834,2031.239060095536843" }, function (err, response) {

  	            var count=0;
                var data = { results: [] };
            var success = function (err, respons, loc) {
                    data.results[count]=respons.result;
                    data.results[count].description=loc.description;
                    count++;
    	        if(response.predictions.length==count)
    		        {
    			       ///////////////////////////////////////////////////////

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
                          locations.addObjects(result, function(err, content) {
                                console.log("adding :",content);
                                locations.search(address, function searchDone(err, content) {
                                 Callback && Callback(content.hits);
                               });

                            });



                    });


                    /////////////////////////////////////////////////////////////
    		        }
            };

            for(var index in response.predictions) {
                var cb = (function (index) {
                    return function (err, res) {
                        success(err, res, response.predictions[index]);
                    };
                })(index);
                places.details({ reference: response.predictions[index].reference, language: "ar"}, cb);
          }
        });

    }




    searchGeo(geo: Geometry, Callback) {
    }
}
export = GooglePlaceSource;
