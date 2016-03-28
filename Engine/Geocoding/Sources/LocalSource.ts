import ISource = require('../Interfaces/ISource');
import Location = require("../../Models/Location");
import Geometry = require('../../Models/Geometry');
import mongoose = require('mongoose');
import QueryModel = require('../../../models/Query');
import QueryData = QueryModel.Model;
import Locations = require('../../../models/Locations');
import LocationData = Locations.Model;
import async = require('async');
var algoliasearch = require('algoliasearch');
var client = algoliasearch('UQ64MH28TZ', '632ee7791625b3000b4944e4b0a8cf92');
var index = client.initIndex('locations');
class LocalSource implements ISource {
    name: String;

    constructor() {
        this.name = "LocalSource";
    }
    map(orignal: any): Location {
        return;
    }
    searchAddress(address: string, Callback) {
        QueryData.find({ SearchQuery: address }, function (err, res) {
            if (err || res.length == 0) {
                console.log("No results Cached for this search query : ", address);
                Callback && Callback(false);
            } else {
                index.search(address, function searchDone(err, content) {
                    console.log("content :",content);
                    Callback && Callback(content.hits);
                });
              /*  var arrayOfResults: any[] = [];
                var functions = new Array<Function>();
                function createFunction(resultId) {
                    return function (cb) {
                        LocationData.find({ _id: resultId }, function (error, data) {
                            cb && cb(null, data);
                        });
                    }
                }
                for (var i = 0; i < res.length; i++) {
                    for (var y = 0; y < res[i]['PlacesID'].length; y++) {
                        var element = res[i]['PlacesID'][y];
                        var func = createFunction(element);
                        functions.push(func);
                    }
                }
                async.parallel(functions, function (err, resultAsync) {
                    var returnres = new Array();
                    for (var i in resultAsync) {
                        returnres = returnres.concat(resultAsync[i]);
                    }
                    Callback && Callback(returnres);
                });*/
            }
        });
    }
    searchGeo(geo: Geometry, Callback) {

        QueryData.find({ SearchQuery: geo.location }, function (err, res) {
            if (err || res.length == 0) {
                console.log("No results Cached for this search query : ", geo.location);
                Callback && Callback(false);
            } else {
                var arrayOfResults: any[] = [];
                var functions = new Array<Function>();
                function createFunction(resultId) {
                    return function (cb) {
                        LocationData.find({ _id: resultId }, function (error, data) {
                            cb && cb(null, data);
                        });
                    }
                }
                for (var i = 0; i < res.length; i++) {
                    for (var y = 0; y < res[i]['PlacesID'].length; y++) {
                        var element = res[i]['PlacesID'][y];
                        var func = createFunction(element);
                        functions.push(func);
                    }
                }
                async.parallel(functions, function (err, resultAsync) {
                    var returnres = new Array();
                    for (var i in resultAsync) {
                        returnres = returnres.concat(resultAsync[i]);
                    }
                    Callback && Callback(returnres);
                });
            }
        });

    }

}
export = LocalSource;
