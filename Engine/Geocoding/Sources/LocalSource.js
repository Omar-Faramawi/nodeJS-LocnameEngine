var QueryModel = require('../../../models/Query');
var QueryData = QueryModel.Model;
var Locations = require('../../../models/Locations');
var LocationData = Locations.Model;
var async = require('async');
var algoliasearch = require('algoliasearch');
var client = algoliasearch('UQ64MH28TZ', '632ee7791625b3000b4944e4b0a8cf92');
var index = client.initIndex('locations');
var LocalSource = (function () {
    function LocalSource() {
        this.name = "LocalSource";
    }
    LocalSource.prototype.map = function (orignal) {
        return;
    };
    LocalSource.prototype.searchAddress = function (address, Callback) {
        QueryData.find({ SearchQuery: address }, function (err, res) {
            if (err || res.length == 0) {
                console.log("No results Cached for this search query : ", address);
                Callback && Callback(false);
            }
            else {
                index.search(address, function searchDone(err, content) {
                    console.log("content :", content);
                    Callback && Callback(content.hits);
                });
            }
        });
    };
    LocalSource.prototype.searchGeo = function (geo, Callback) {
        QueryData.find({ SearchQuery: geo.location }, function (err, res) {
            if (err || res.length == 0) {
                console.log("No results Cached for this search query : ", geo.location);
                Callback && Callback(false);
            }
            else {
                var arrayOfResults = [];
                var functions = new Array();
                function createFunction(resultId) {
                    return function (cb) {
                        LocationData.find({ _id: resultId }, function (error, data) {
                            cb && cb(null, data);
                        });
                    };
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
    };
    return LocalSource;
})();
module.exports = LocalSource;
