var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    email: String,
    password: String,
    displayName: String
});

exports.Model = mongoose.model("User", userSchema);
//# sourceMappingURL=User.js.map
