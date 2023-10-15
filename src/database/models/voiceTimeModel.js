const mongoose = require('mongoose');

const voiceTimeSchema = new mongoose.Schema({
     userId: String,
     Start: Number,
     guildId: String,
})

const voiceTimeModel = mongoose.model("voice-time", voiceTimeSchema);

module.exports = voiceTimeModel;