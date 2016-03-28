var assert = require('assert');
var GoogleMaps = require('../Engine/Geocoding/Sources/GoogleMapsSource');
var Geocoder = require('../Engine/Geocoding/Geocoder/Geocoder');

var WikiMapiaSource = require('../Engine/Geocoding/Sources/WikimapiaSource');

var GeocoderObj = new Geocoder.Geocoder();
var googleMaps;
describe("Geocoder Test", function () {
    beforeEach(function () {
        googleMaps = new GoogleMaps();
        GeocoderObj.addSource(new GoogleMaps());
        GeocoderObj.addSource(new WikiMapiaSource());
    });

    it("should has searchAddress Function", function () {
        assert.notEqual(googleMaps.searchAddress, undefined, 'The object does not have search function');
    });
    it("addSource Function Test ", function () {
        GeocoderObj.sources.length;
        assert.equal(GeocoderObj.sources.length, 2, 'sources error');
    });
    it("SearchAddress Test", function (done) {
        GeocoderObj.searchAddress("cairo", function (data) {
            assert.equal(typeof (data[0][0].formated_address), "string");
            done();
        });
    });
    it("SearchGeo Test", function (done) {
        var geo = {
            location: "31.235428,30.045100",
            location_type: ""
        };
        GeocoderObj.searchGeo(geo, function (data) {
            assert.equal(typeof (data[0][0].formated_address), "string");
            done();
        });
    });
});
//# sourceMappingURL=GeocoderUnitTest.js.map
