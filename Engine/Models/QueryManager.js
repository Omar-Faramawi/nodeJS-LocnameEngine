var QueryModel = require('../../models/Query');
var QueryData = QueryModel.Model;
var QueryManager = (function () {
    function QueryManager() {
    }
    QueryManager.prototype.saveQuery = function (searchQuery, locations) {
        QueryData.find({ SearchQuery: searchQuery }, function (err, res) {
            if (res.length == 0) {
                QueryData.create({
                    SearchQuery: searchQuery,
                    PlacesID: locations
                }, function (err, success) {
                    if (err) {
                        console.log("QueryData saving failed");
                    }
                });
            } else {
                var newLocations = res[0]['PlacesID'];
                for (var item in locations) {
                    if (!(locations[item] in newLocations))
                        newLocations.push(locations[item]);
                }
                QueryData.update({ SearchQuery: searchQuery }, { PlacesID: newLocations }, function (err, affectedRows, raw) {
                    console.log(err);
                });
            }
        });
    };
    return QueryManager;
})();

module.exports = QueryManager;
//# sourceMappingURL=QueryManager.js.map
