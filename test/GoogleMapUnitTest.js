var assert = require('assert');
var GoogleMaps = require('../Engine/Geocoding/Sources/GoogleMapsSource');
var Geocoder = require('../Engine/Geocoding/Geocoder/Geocoder');
var GeocoderObj = new Geocoder.Geocoder();
var googleMaps;
var GoogleMapsSource = require('../Engine/Geocoding/Sources/GoogleMapsSource');
GeocoderObj.addSource(new GoogleMapsSource());
describe("Google Maps Test", function () {
    beforeEach(function () {
        googleMaps = new GoogleMaps();
    });

    it("should has searchAddress Function", function () {
        assert.notEqual(googleMaps.searchAddress, undefined, 'The object does not have search function');
    });

    it("should has Map function ", function () {
        assert.notEqual(googleMaps.map, undefined, 'the project does not have map function');
    });

    it("Search Adress return ", function (done) {
        GeocoderObj.searchAddress("cairo", function (data) {
            assert.equal(typeof (data[0][0].formated_address), "string");
            done();
        });
    });
    it("test async", function (done) {
        setTimeout(function () {
            done();
        }, 1000);
    });
});
//# sourceMappingURL=GoogleMapUnitTest.js.map
