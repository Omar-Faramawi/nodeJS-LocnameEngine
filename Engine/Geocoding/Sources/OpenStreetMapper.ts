import ISourceMapper = require('../Interfaces/ISourceMapper');
import Geometry = require("../../Models/Geometry");
import Location = require("../../Models/Location");

class OpenStreetMapper implements ISourceMapper {
    
    map(orignal: any, target:Location): Location {
        var geoObj: Geometry = {
            location: orignal.latitude + ' , ' + orignal.longitude, 
            location_type: ""
        };

        var addressComponents: Object = { street_address: orignal.streetName, country: orignal.country, city: orignal.city };
        
        
        var formatedAddress = ((orignal.streetNumber) ? orignal.streetNumber + ' , ' : '') + ((orignal.streetName) ? orignal.streetName + ' , ':'')  +
            ((orignal.city) ? orignal.city + ' , ' : 's')  + ((orignal.state) ? orignal.state + ' , ' : '')  + ((orignal.country) ? orignal.country:'');
        target.formatted_address = formatedAddress;
        target.geometry = geoObj;
        target.source = "OpenStreetMap";
        target.address_components = addressComponents;
        return target;
    }

    
}

export = OpenStreetMapper;