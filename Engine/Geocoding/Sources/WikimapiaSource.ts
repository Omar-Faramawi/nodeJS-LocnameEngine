import ISource = require('../Interfaces/ISource');
import Location = require("../../Models/Location");
import WikimapiaSourceMapper = require('./WikimapiaSourceMapper');
import Geometry = require('../../Models/Geometry');
import http = require('http');
import LocationManager = require('../../Models/LocationManager');
import QueryManger = require('../../Models/QueryManager');
import async = require('async');


class WikimapiaSource implements ISource {
    name: String;

    constructor() {
        this.name = "WikimapiaSource";
    }

    map(orignal: any) : Location {
        var target = new Location();
        var wikimapiaMapperObj = new WikimapiaSourceMapper();
        var result = wikimapiaMapperObj.map(orignal, target);
        return result;
    }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    searchAddress(address: string, Callback) {
        var result: any[] = [];
        var that = this;
        var arrayOfLocationsIds: any[] = [];
        var searchObj : any = {
            typed: address,
            apiKey: 'D86F28B1-E0AF7341-2FDE2483-6C4C7195-7C3C78F1-0E2AA58D-864E9532-B7F38C2F',
            options: ['main', 'location'],
            lon: '31.235428',
            lat: '30.045100'
        };

        /////////////////////////////////////////////////////////////////////////////////////////////////////
        search(searchObj, function (data) {
            var LocationManagerObj = new LocationManager();
            function saveLocation(object) {
                return function (cb) {
                    LocationManagerObj.saveLocations(object, that, function (data) {
                        cb && cb(null, data);
                    });
                }
            }

            var parsedData = JSON.parse(data);
            var returnObject: any[] = [];
            var functions = new Array<Function>();
            for (var attributename in parsedData['places']) {
                var thisResultObj = parsedData['places'][attributename];
                var fun = saveLocation(thisResultObj);
                functions.push(fun);
            }

            async.parallel(functions, function (err, res) {

                for (var obj in res) {
                    result.push(res[obj].Location);
                    arrayOfLocationsIds.push(res[obj].LocationID);
                }

                console.log("Wikimapia Text search");
                var QueryMangerobj = new QueryManger();
                QueryMangerobj.saveQuery(address, arrayOfLocationsIds);
                Callback && Callback(result);

            });
        }); 
    }
     ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    searchGeo(geo: Geometry, Callback) {
        var result: any[] = [];
        var that = this;
        var arrayOfLocationsIds: any[] = [];
        var geometryArray = geo.location.split(',');
        var searchObj: any = {
            typed: "",
            apiKey: 'D86F28B1-E0AF7341-2FDE2483-6C4C7195-7C3C78F1-0E2AA58D-864E9532-B7F38C2F',
            options: ['main', 'location'],
            lon: parseFloat(geometryArray[0]),
            lat: parseFloat (geometryArray[1])
        };
        search(searchObj, function (data) {
            var LocationManagerObj = new LocationManager();
            function saveLocation(object) {
                return function (cb) {
                    LocationManagerObj.saveLocations(object, that, function (data) {
                        cb && cb(null, data);
                    });
                }
            }

            var parsedData = JSON.parse(data);
            var returnObject: any[] = [];
            var functions = new Array<Function>();
            for (var attributename in parsedData['places']) {
                var thisResultObj = parsedData['places'][attributename];
                var fun = saveLocation(thisResultObj);
                functions.push(fun);
            }

            async.parallel(functions, function (err, res) {

                for (var obj in res) {
                    result.push(res[obj].Location);
                    arrayOfLocationsIds.push(res[obj].LocationID);
                }

                console.log("Wikimapia Text search");
                var QueryMangerobj = new QueryManger();
                QueryMangerobj.saveQuery(geo.location, arrayOfLocationsIds);
                Callback && Callback(result);

            });
        }); 
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
function search(object, cb) {

    if (object.apiKey != "" && object.lon != "" && object.lat != "") {
        var path = "http://api.wikimapia.org/?function=place.search&key=" + object.apiKey + "&q=" + object.typed + "&format=json&lat=" + object.lat + "&lon=" + object.lon;
        if (object.options.length != 0) {
            path = path.concat("&data_blocks=");
            for (var i = 0; i < object.options.length; i++) {
                var param = object.options[i].concat(",");
                path = path.concat(param);
            }
            path = path.substring(0, path.length - 1);
        }

        http.get(path, function (res) {
            var str = '';
            //console.log('Response is '+res.statusCode);
            res.on('data', function (chunk) {
	               str += chunk;
            });

            res.on('end', function () {
                cb && cb(str);
            });
        });
        console.log(path);
    } else {
        return { error: "Your are searching for empty string or your API key is invalid, please check your object again" };
    }

};

function getByObjectId(object, cb) {

    if (object.id != "" && object.apiKey != "") {
        var path = "http://api.wikimapia.org/?function=place.getbyid&key=" + object.apiKey + "&id=" + object.id + "&format=json";
        console.log(path);
        http.get(path, function (res) {
            var str = '';
            console.log('Response is ' + res.statusCode);
            res.on('data', function (chunk) {
	               str += chunk;
            });

            res.on('end', function () {
                cb && cb(str);
            });
        });
    } else {
        return { error: "Place id doesn't exist or your api key is invalid" };
    }

};

export = WikimapiaSource;