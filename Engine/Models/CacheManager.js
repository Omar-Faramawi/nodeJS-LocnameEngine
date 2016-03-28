var sourceDataModel = require('../../models/SourceData');
var SourceData = sourceDataModel.Model;
var CacheManager = (function () {
    function CacheManager() {
    }
    CacheManager.prototype.saveOriginal = function (original, source, callback) {
        var originalString = JSON.stringify(original);
        var sourceId;
        console.log("Source Name : " + source.name);
        if (original.place_id == undefined) {
            sourceId = original.id + "." + source.name;
        }
        else {
            sourceId = original.place_id + "." + source.name;
        }
        SourceData.find({ sourceId: sourceId }, function (err, res) {
            if (err || res.length == 0) {
                SourceData.create({
                    sourceName: source.name,
                    sourceId: sourceId,
                    source: originalString
                }, function (err, success) {
                    if (err) {
                        console.log("Caching failed");
                    }
                    else {
                        callback && callback(sourceId);
                    }
                });
            }
            else {
                callback && callback(sourceId = false);
            }
        });
    };
    return CacheManager;
})();
module.exports = CacheManager;
