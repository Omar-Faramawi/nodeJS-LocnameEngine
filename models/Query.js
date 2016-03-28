var mongoose = require('mongoose');

exports.QueryData = new mongoose.Schema({
    SearchQuery: {
        type: 'string',
        index: { unique: true }
    },
    PlacesID: Array
});

exports.Model = mongoose.model("QueryData", exports.QueryData);
//# sourceMappingURL=Query.js.map
