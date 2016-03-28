import ISourceMapper = require('../Interfaces/ISourceMapper');
import Location = require('../../Models/Location');
import Geomerty = require('../../Models/Geometry');

class WikimapiaSourceMapper implements ISourceMapper {
    map(original: any, target: Location): Location{
        
        var geometryObj: Geomerty = {
            location: original.location.lat + "," + original.location.lon,
            location_type: ""
        };
        var addressComponentArray: Object = { 'street_address': original.location.street, 'country': original.location.country, 'city': original.location.city };
        target.formatted_address = original.title;
        target.geometry = geometryObj;
        target.source = "wikimapia";
        target.address_components = addressComponentArray;
        
        return target;
    }
}

export = WikimapiaSourceMapper;