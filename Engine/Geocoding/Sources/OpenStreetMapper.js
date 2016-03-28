var OpenStreetMapper = (function () {
    function OpenStreetMapper() {
    }
    OpenStreetMapper.prototype.map = function (orignal, target) {
        var geoObj = {
            location: orignal.latitude + ' , ' + orignal.longitude,
            location_type: ""
        };

        var addressComponents = { street_address: orignal.streetName, country: orignal.country, city: orignal.city };

        var formatedAddress = ((orignal.streetNumber) ? orignal.streetNumber + ' , ' : '') + ((orignal.streetName) ? orignal.streetName + ' , ' : '') + ((orignal.city) ? orignal.city + ' , ' : 's') + ((orignal.state) ? orignal.state + ' , ' : '') + ((orignal.country) ? orignal.country : '');
        target.formatted_address = formatedAddress;
        target.geometry = geoObj;
        target.source = "OpenStreetMap";
        target.address_components = addressComponents;
        return target;
    };
    return OpenStreetMapper;
})();

module.exports = OpenStreetMapper;
//# sourceMappingURL=OpenStreetMapper.js.map
