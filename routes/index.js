var Geocoder = require('../Engine/Geocoding/Geocoder/Geocoder');
var EdittedLocationSource = require('../Engine/Geocoding/Sources/EdittedLocationSource');
var GooglePlaceSource = require('../Engine/Geocoding/Sources/GooglePlaceSource');
var algoliasearch = require('algoliasearch');
var client = algoliasearch('UQ64MH28TZ', '632ee7791625b3000b4944e4b0a8cf92');
var locations = client.initIndex('locations');
function index(req, res) {
    res.render('map', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page.' });
}
exports.index = index;
;
function about(req, res) {
    res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page.' });
}
exports.about = about;
;
function contact(req, res) {
    res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page.' });
}
exports.contact = contact;
;
function map(req, res) {
    var searchText = req.params.address;
    var GeocoderObj = new Geocoder.Geocoder();
    GeocoderObj.addSource(new GooglePlaceSource());
    GeocoderObj.searchAddress(searchText, function (data) {
        var returnres = new Array();
        for (var i in data) {
            if (data[i].source == "Google") {
                returnres.push(data[i]);
            }
        }
        var EdittedLocationObj = new EdittedLocationSource();
        res.send(returnres);
    });
}
exports.map = map;
;
function saveLocation(req, res) {
    var query = req.query.query;
    var location = JSON.parse(req.query.location);
    console.log("location   :", location);
    var type = location.status;
    var EdittedLocationObj = new EdittedLocationSource();
    if (type == "SES" || type == "FS") {
        console.log(location);
        EdittedLocationObj.saveEditted(query, location, function (saveRes) {
            res.send(saveRes);
        });
    }
    else if (type == "SS") {
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
}
exports.saveLocation = saveLocation;
;
//# sourceMappingURL=index.js.map
function register(req, res){
    res.render('register');
}
exports.register = register;

function login(req, res){
    res.render('login');
}
exports.login = login;

function dashboard(req, res){
    res.render('dashboard');
}
exports.dashboard = dashboard;