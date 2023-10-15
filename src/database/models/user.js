const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
     userId: String,
     guildId: String,
     banned: {
          type: Boolean,
          default: false
     }
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;