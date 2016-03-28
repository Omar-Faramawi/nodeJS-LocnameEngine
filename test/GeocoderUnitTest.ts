import assert = require('assert');
import GoogleMaps = require('../Engine/Geocoding/Sources/GoogleMapsSource');
import Geocoder = require('../Engine/Geocoding/Geocoder/Geocoder');
import GoogleMapsSource = require('../Engine/Geocoding/Sources/GoogleMapsSource');
import WikiMapiaSource = require('../Engine/Geocoding/Sources/WikimapiaSource');
import Geometry = require('../Engine/Models/Geometry');
var GeocoderObj = new Geocoder.Geocoder();
var googleMaps;
describe("Geocoder Test", () => {
    beforeEach(function () {
        googleMaps = new GoogleMaps();
        GeocoderObj.addSource(new GoogleMaps());
        GeocoderObj.addSource(new WikiMapiaSource());
    });

    it("should has searchAddress Function", () => {
        assert.notEqual(googleMaps.searchAddress, undefined, 'The object does not have search function');
    });
    it("addSource Function Test ", () => {
        GeocoderObj.sources.length
        assert.equal(GeocoderObj.sources.length, 2, 'sources error');
    });
    it("SearchAddress Test", (done) => {
        GeocoderObj.searchAddress("cairo", function (data) {
            assert.equal(typeof (data[0][0].formated_address), "string");
            done();
        });
    });
    it("SearchGeo Test", (done) => {
        var geo: Geometry = {
            location: "31.235428,30.045100",
            location_type: ""
        };
        GeocoderObj.searchGeo(geo, function (data) {
            assert.equal(typeof (data[0][0].formated_address), "string");
            done();
        });
    });



});
