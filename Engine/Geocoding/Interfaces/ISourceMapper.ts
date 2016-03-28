import Location = require('../../Models/Location');

interface ISourceMapper {
    map(original: any, target: Location) : Location;
}

export = ISourceMapper;