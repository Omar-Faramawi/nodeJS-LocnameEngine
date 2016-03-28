//Dependencies
///<reference path="../../../Scripts/async.d.ts" />
import ISource = require('../Interfaces/ISource');
import Geometry = require('../../Models/Geometry');
import async = require('async');
import LocalSource = require('../Sources/LocalSource');


export class Geocoder {
    // Attributes
    cashResults: boolean;

    localOnly: boolean;

    sources: ISource[] = new Array();

    //operations
    addSource(source: ISource) {
        this.sources.push(source);
    }

    searchAddress(address: string, Callback) {

        var LocalSourceObj = new LocalSource();

        var that = this;
        LocalSourceObj.searchAddress(address, function (data) {
            if (data == false) {
                that.searchAddressRemotly(address, function (data) {
                    Callback && Callback(data);
                });
            } else {
                Callback && Callback(data);
            }
        });
    }

    /**************Search Address Remotly*****************/
    searchAddressRemotly(address, Callback) {

        function createFunction(source: ISource): any {
                return function (cb) {
                source.searchAddress(address, function (data) {

                    cb && cb(null, data);
                });
            }
        }
        var functions = new Array<Function>();
        var returnObj = [];
        console.log(this.sources);
        for (var i = 0; i < this.sources.length; i++) {
            var source = this.sources[i];
            var fun = createFunction(source);
            functions.push(fun);
        }
        async.series(functions, function (err, res) {
            var returnres=new Array();
            for (var i in res) {
                returnres = returnres.concat(res[i]);
            }
            // console.log(res[2])
            Callback && Callback(returnres);
        });
    }
    /**************End Remote search***************/
    searchGeo(geo: Geometry, Callback) {

        var LocalSourceObj = new LocalSource();

        var that = this;
        LocalSourceObj.searchGeo(geo, function (data) {
            if (data == false) {
                that.searchGeoRemotly(geo, function (data) {
                    Callback && Callback(data);
                });
            } else {
                Callback && Callback(data);
            }
        });


    }
    /**************Search Geo Remotly*****************/
    searchGeoRemotly(geo, Callback) {

        function createFunction(source: ISource): any {
                return function (cb) {
                source.searchGeo(geo, function (data) {

                    cb && cb(null, data);
                });
            }
        }
        var functions = new Array<Function>();
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
            // console.log(res[2])
            Callback && Callback(returnres);
        });
    }
    /**************End Remote search***************/
}
