var WikimapiaSourceMapper = (function () {
    function WikimapiaSourceMapper() {
    }
    WikimapiaSourceMapper.prototype.map = function (original, target) {
        var geometryObj = {
            location: original.location.lat + "," + original.location.lon,
            location_type: ""
        };
        var addressComponentArray = { 'street_address': original.location.street, 'country': original.location.country, 'city': original.location.city };
        target.formatted_address = original.title;
        target.geometry = geometryObj;
        target.source = "wikimapia";
        target.address_components = addressComponentArray;

        return target;
    };
    return WikimapiaSourceMapper;
})();

module.exports = WikimapiaSourceMapper;
//# sourceMappingURL=WikimapiaSourceMapper.js.map
