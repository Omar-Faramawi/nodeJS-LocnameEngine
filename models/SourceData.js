var mongoose = require('mongoose');

exports.SourceData = new mongoose.Schema({
    sourceName: String,
    sourceId: String,
    source: String
});

exports.Model = mongoose.model("SourceData", exports.SourceData);
//# sourceMappingURL=SourceData.js.map
