import mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    email: String,
    password: String,
    displayName: String
});

export interface Interface extends mongoose.Document {
    email: String;
    password: String;
    displayName: String;
}

export var Model = mongoose.model<Interface>("User", userSchema);