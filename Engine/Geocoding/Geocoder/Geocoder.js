var async = require('async');
var LocalSource = require('../Sources/LocalSource');
var Geocoder = (function () {
    function Geocoder() {
        this.sources = new Array();
    }
    Geocoder.prototype.addSource = function (source) {
        this.sources.push(source);
    };
    Geocoder.prototype.searchAddress = function (address, Callback) {
        var LocalSourceObj = new LocalSource();
        var that = this;
        LocalSourceObj.searchAddress(address, function (data) {
            if (data == false) {
                that.searchAddressRemotly(address, function (data) {
                    Callback && Callback(data);
                });
            }
            else {
                Callback && Callback(data);
            }
        });
    };
    Geocoder.prototype.searchAddressRemotly = function (address, Callback) {
        function createFunction(source) {
            return function (cb) {
                source.searchAddress(address, function (data) {
                    cb && cb(null, data);
                });
            };
        }
        var functions = new Array();
        var returnObj = [];
        console.log(this.sources);
        for (var i = 0; i < this.sources.length; i++) {
            var source = this.sources[i];
            var fun = createFunction(source);
            functions.push(fun);
        }
        async.series(functions, function (err, res) {
            var returnres = new Array();
            for (var i in res) {
                returnres = returnres.concat(res[i]);
            }
            Callback && Callback(returnres);
        });
    };
    Geocoder.prototype.searchGeo = function (geo, Callback) {
        var LocalSourceObj = new LocalSource();
        var that = this;
        LocalSourceObj.searchGeo(geo, function (data) {
            if (data == false) {
                that.searchGeoRemotly(geo, function (data) {
                    Callback && Callback(data);
                });
            }
            else {
                Callback && Callback(data);
            }
        });
    };
    Geocoder.prototype.searchGeoRemotly = function (geo, Callback) {
        function createFunction(source) {
            return function (cb) {
                source.searchGeo(geo, function (data) {
                    cb && cb(null, data);
                });
            };
        }
        var functions = new Array();
        var returnObj = [];
        console.log(this.sources);
        for (var i = 0; i < this.sources.length; i++) {
            var source = this.sources[i];
            var fun = createFunction(source);
            functions.push(fun);
        }
        async.parallel(functions, function (err, res) {
            var returnres = new Array();
            for (var i in res) {
                returnres = returnres.concat(res[i]);
            }
            Callback && Callback(returnres);
        });
    };
    return Geocoder;
})();
exports.Geocoder = Geocoder;
