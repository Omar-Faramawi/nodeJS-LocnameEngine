import mongoose = require('mongoose');

export var QueryData = new mongoose.Schema({
    SearchQuery: {
        type: 'string',
        index: { unique: true }
        },
    PlacesID: Array
});

export interface QueryDataInterface extends mongoose.Document {
    SearchQuery: string;
    PlacesID: Array<string>;
}

export var Model = mongoose.model<QueryDataInterface>("QueryData", QueryData);