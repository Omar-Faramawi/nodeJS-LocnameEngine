import Location = require("../../Models/Location");
import ISourceMapper = require('../Interfaces/ISourceMapper');
import Geometry = require("../../Models/Geometry");
class GoogleMapsSourceMapper implements ISourceMapper {
    map(original: any, target: Location): Location {
        var gemetryObj: Geometry = {
            location: original.geometry.location.lat + "," + original.geometry.location.lng,
            location_type: original.geometry.location_type
        };
        var country;
        var city;
        var governorate;
        var street="";
        var district = "";
        var street_number = "";
        var postal_code = "";
        var floor_number="";
        for (var i in original.address_components) {
            if (original.address_components[i].types[0] == "country")
                country = original.address_components[i].long_name;
            else if (original.address_components[i].types[0] == "administrative_area_level_1")
                governorate = original.address_components[i].long_name;
            else if (original.address_components[i].types[0] == "locality")
                city = original.address_components[i].long_name;
            else if (original.address_components[i].types[0] == "administrative_area_level_2")
                district = original.address_components[i].long_name;
            else if (original.address_components[i].types[0] == "route")
                street = original.address_components[i].long_name;
            else if (original.address_components[i].types[0] == "street_number")
                street_number = original.address_components[i].long_name;
            else if (original.address_components[i].types[0] == "postal_code")
                postal_code = original.address_components[i].long_name;
            else if (original.address_components[i].types[0] == "floor_number")
                floor_number = original.address_components[i].long_name;
        }
        var address_components = { street_address: street, country: country, governorate: governorate, city: city, district: district, street_number: street_number, postal_code: postal_code,floor_number:floor_number};

        // var address_components=  original.address_components;
        target.description = (original.description) ? original.description : original.formatted_address;
        target.formatted_address = original.formatted_address;
        target.geometry = gemetryObj;
        target.source = "Google";
        target.address_components = address_components;
        target.cacheId = original.place_id + ".GoogleMapsSource";
        target.edited = original.edited;
        return target;
    }
}

export = GoogleMapsSourceMapper;