import mongoose = require('mongoose');

export var SourceData = new mongoose.Schema({
    sourceName: String,
    sourceId: String,
    source: String
});

export interface SourceDataInterface extends mongoose.Document {
    sourceName: string;
    sourceId: string;
    source: string;
}

export var Model = mongoose.model<SourceDataInterface>("SourceData", SourceData);