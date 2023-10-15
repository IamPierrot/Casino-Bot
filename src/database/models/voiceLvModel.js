const mongoose = require('mongoose');


const voiceLevelSchema = new mongoose.Schema({
     userId: String,
     guildId: String,
     level: {
          type: Number,
          default: 1
     },
     xp: { 
          type: Number,
          default: 0
     },
     nextLevel: Number,
     totalTime: {
          type: Number,
          default: 0
     }
});

const voiceLevelModel = mongoose.model("voiceLevel", voiceLevelSchema);

module.exports = voiceLevelModel;