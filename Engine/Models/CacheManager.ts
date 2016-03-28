import mongoose = require('mongoose');
import sourceDataModel = require('../../models/SourceData');
import ISource = require('../Geocoding/Interfaces/ISource');
import SourceData = sourceDataModel.Model;

class CacheManager {
    saveOriginal(original: any,source: ISource, callback: Function) {
        var originalString = JSON.stringify(original);
        var sourceId;
        console.log("Source Name : " + source.name);

         if (original.place_id == undefined) {
            sourceId = original.id + "." + source.name;
        } else {
            sourceId = original.place_id + "." + source.name;
        }
        // Save in database
        SourceData.find({ sourceId: sourceId }, function (err, res) {
            if (err || res.length == 0) {
                SourceData.create({
                    sourceName: source.name,
                    sourceId: sourceId,
                    source: originalString
                }, function (err, success) {
                        if (err) {
                            console.log("Caching failed");
                        } else {
                          callback && callback(sourceId);
                            //console.log("success : ",success);
                        }
                    });
            }
            else{
              callback && callback(sourceId=false);
            }
        });
        
    }
}

export = CacheManager;
