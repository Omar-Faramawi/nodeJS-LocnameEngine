var mongoose = require('mongoose');
exports.Locations = new mongoose.Schema({
    address_components: Object,
    formatted_address: String,
    geometry: Object,
    source: String,
    cacheId: String,
    description: String,
    edited: Boolean,
    select_count: Number,
    objectID: String
});
exports.Model = mongoose.model("Location", exports.Locations);
