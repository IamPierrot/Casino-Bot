const mongoose = require('mongoose');


const extraChannelSchema = new mongoose.Schema({
     guildId: String,
     chatChannelId: [],
     voiceChannelId: [],
})

const extraChannelModel = mongoose.model("extraXpChannel", extraChannelSchema);

module.exports = extraChannelModel;