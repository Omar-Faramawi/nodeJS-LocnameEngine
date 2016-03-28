import mongoose = require('mongoose');
import Geometry = require('../Engine/Models/Geometry');

export var Locations = new mongoose.Schema({
    address_components: Object,
    formatted_address: String,
    geometry: Object,
    source: String,
    cacheId: String,
    description: String,
    edited: Boolean,
    select_count:Number,
    objectID:String
});

export interface LocationsInterface extends mongoose.Document {
    address_component: Object;
    formatted_address: string;
    geometry: Geometry;
    source: string;
    cacheId: string;
    description: string;
    edited: boolean;
    select_count: number;
}

export var Model = mongoose.model<LocationsInterface>("Location", Locations);
