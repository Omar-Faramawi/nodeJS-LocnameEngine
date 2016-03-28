import Location = require('../../Models/Location');
import Geometry = require('../../Models/Geometry');
interface ISource {
    name: String;
    map(orignal: any) : Location;
    searchAddress(address: string, Callback);
    searchGeo(geo: Geometry, Callback);
}

export = ISource;