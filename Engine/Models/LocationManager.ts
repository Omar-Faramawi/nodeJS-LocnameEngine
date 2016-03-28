import ISource = require('../Geocoding/Interfaces/ISource');
import Location = require('./Location');
import CacheManager = require('./CacheManager');
import mongoose = require('mongoose');
import LocationsModel = require('../../models/Locations');
import LocationData = LocationsModel.Model;

class LocationManager {

    saveLocations(original: any, source: ISource, callback: Function) {
        var edited = false;
        var cacheManagerObj = new CacheManager();
        var that = this;
        var object;
        var mappedLocation
        if (original.cacheId) {
            mappedLocation = original;
            edited = true;
            LocationData.create({
                description: mappedLocation.description,
                address_components: mappedLocation.address_components,
                formatted_address: mappedLocation.formatted_address,
                geometry: mappedLocation.geometry,
                source: mappedLocation.source,
                cacheId: original.cacheId,
                edited: edited,
                select_count:0
            }, function (err, success) {
                if (err) {
                    console.log("Location saving failed");
                } else {
                    //console.log("Success : ", success);
                    object = {
                        Location: success,
                        LocationID: success._id
                    };
                    callback && callback(object);
                }
            });
        }
        else
        {
        cacheManagerObj.saveOriginal(original, source, function (data) {
            var sourceId = data;
                 mappedLocation = source.map(original);

            // SAVE In database
            if(sourceId){
            LocationData.create({
                description: mappedLocation.description,
                address_components: mappedLocation.address_components,
                formatted_address: mappedLocation.formatted_address,
                geometry: mappedLocation.geometry,
                source: mappedLocation.source,
                cacheId: sourceId,
                edited: edited,
                select_count:0
            }, function (err, success) {
                if (err) {
                    console.log("Location saving failed");
                } else {
                    //console.log("Success : ", success);
                    object = {
                        Location: success,
                        LocationID: success._id
                    };
                    callback && callback(object);
                }
            });
          }
          else{
            if (original.place_id == undefined) {
               sourceId = original.id + "." + source.name;
           } else {
               sourceId = original.place_id + "." + source.name;
           }
            LocationData.find({ cacheId: sourceId }, function (err, res) {
            if(res.length!=0) {
              console.log("saving : ",res[0]);
              object = {
                  Location: res[0],
                  LocationID: res[0]._id
              };
                callback && callback(object);
              }
            });
          }
        });
      }
    }
}

export = LocationManager;
