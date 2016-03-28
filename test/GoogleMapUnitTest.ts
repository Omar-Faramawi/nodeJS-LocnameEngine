import assert = require('assert');
import GoogleMaps = require('../Engine/Geocoding/Sources/GoogleMapsSource');
import Geocoder = require('../Engine/Geocoding/Geocoder/Geocoder');
var GeocoderObj = new Geocoder.Geocoder();
var googleMaps;
import GoogleMapsSource = require('../Engine/Geocoding/Sources/GoogleMapsSource');
GeocoderObj.addSource(new GoogleMapsSource());
describe("Google Maps Test", () => {
    beforeEach(function () {
        googleMaps = new GoogleMaps();
    });

    it("should has searchAddress Function", () => {
        assert.notEqual(googleMaps.searchAddress, undefined, 'The object does not have search function');
    });

    it("should has Map function ", () => {
        assert.notEqual(googleMaps.map, undefined, 'the project does not have map function')
    });

    it("Search Adress return ", (done) => {
        GeocoderObj.searchAddress("cairo", function (data) {
            assert.equal(typeof (data[0][0].formated_address), "string");
            done();
        });

    });
    it("test async", (done) => {
        setTimeout(function () {
            done();
        }, 1000);
    });

});
