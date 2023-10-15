const mongoose = require('mongoose')


const chatLevelSchema = new mongoose.Schema({
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
     nextLevel: {
          type: Number,
          default: 500
     },
     totalText: {
          type: Number,
          default: 0
     }
})

const chatLevelModel = mongoose.model('chatLevel', chatLevelSchema);

module.exports = chatLevelModel;