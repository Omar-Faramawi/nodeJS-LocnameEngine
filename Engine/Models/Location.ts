import Geometry = require("Geometry");

class Location {
    address_components: Object;
    formatted_address: string;
    geometry: Geometry;
    source: string;
    description: string;
    cacheId: string;
    edited: boolean;
    select_count:number;
}

export = Location;