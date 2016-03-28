/*
 * GET home page.
 */
import express = require('express');
import User = require('../models/User');
import Geocoder = require('../Engine/Geocoding/Geocoder/Geocoder');
import GoogleMapsSource = require('../Engine/Geocoding/Sources/GoogleMapsSource');
import EdittedLocationSource = require('../Engine/Geocoding/Sources/EdittedLocationSource');
import GooglePlaceSource = require('../Engine/Geocoding/Sources/GooglePlaceSource');
import WikimapiaSource = require('../Engine/Geocoding/Sources/WikimapiaSource');
import Geometry = require('../Engine/Models/Geometry');
import OpenStreetSource = require('../Engine/Geocoding/Sources/OpenStreetSource');
var algoliasearch = require('algoliasearch');
var client = algoliasearch('UQ64MH28TZ', '632ee7791625b3000b4944e4b0a8cf92');
var locations = client.initIndex('locations');

export function index(req: express.Request, res: express.Response) {
    //res.render('index', { title: 'Express', year: new Date().getFullYear() });
/*
    var user:User.Interface = new User.Model({ email: "user@appsilon.pl" });
    user.save();

    var searchText = "banha";

    var GeocoderObj = new Geocoder.Geocoder();

        //adding Sources

         GeocoderObj.addSource(new GoogleMapsSource());
         GeocoderObj.addSource(new WikimapiaSource());
         GeocoderObj.addSource(new OpenStreetSource());


        GeocoderObj.searchAddress(searchText, function (data) {
         console.log("address    :",data);
    });




    var geo: Geometry = {
       location: "31.235428,30.045100",
      location_type: ""
    };

      GeocoderObj.searchGeo(geo, function (data) {
       console.log("Geo     :",data);
    });





    console.log(user._id);*/
    res.render('map', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page.' });

};

export function about(req: express.Request, res: express.Response) {
    res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page.' });
};

export function contact(req: express.Request, res: express.Response) {
    res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page.' });
};
export function map(req: express.Request, res: express.Response) {
    var searchText = req.params.address;
    var GeocoderObj = new Geocoder.Geocoder();

    //adding Sources
    GeocoderObj.addSource(new GooglePlaceSource());
   // GeocoderObj.addSource(new WikimapiaSource());
   // GeocoderObj.addSource(new OpenStreetSource());


    GeocoderObj.searchAddress(searchText, function (data) {
        var returnres = new Array();
        for (var i in data) {
            if (data[i].source == "Google") {
                returnres.push(data[i]);
            }
        }
        var EdittedLocationObj = new EdittedLocationSource();
       // EdittedLocationObj.saveEditted(searchText, returnres[0], function (res) {
       //     console.log("saving Relsult ",res);
       // });
    //  console.log(data);
       res.send(returnres);
    });

};
export function saveLocation(req: express.Request, res: express.Response) {
    var query = req.query.query;
    var location = JSON.parse(req.query.location);
    console.log("location   :", location);
    var type = location.status;
   // res.send(location);

    var EdittedLocationObj = new EdittedLocationSource();

    if (type == "SES" || type == "FS") {
        console.log(location);
        EdittedLocationObj.saveEditted(query, location, function (saveRes) {
            res.send(saveRes);
        });
    }

    else  if (type == "SS" ) {
        console.log(location);
        EdittedLocationObj.saveEditted(query, location, function (saveRes) {
            res.send(saveRes);
        });
    }
    else if (type == "FES" && location.original && location.edited) {
        var loc1 = location.original;
        var loc2 = location.edited;

        EdittedLocationObj.saveEditted(query, loc1, function (saveRes1) {
            console.log(saveRes1);
            EdittedLocationObj.saveEditted(query, loc2, function (saveRes2) {
                console.log(saveRes2);
                res.send(saveRes2);
            });
        });
    }

};
