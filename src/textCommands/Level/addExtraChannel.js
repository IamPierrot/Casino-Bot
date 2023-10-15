const extraChannelModel = require('../../database/models/extraChannels');
const { ChannelType } = require('discord.js')


module.exports = {
     name: "addextrachannel",
     aliases: ["addec"],
     description: "thêm kênh bonus exp",
     adminOnly: true,
     showHelp: false,

     callback: async (client, message, args) => {
          let extraChannelData = await extraChannelModel.findOne({ guildId: message.guild.id });
          const listChannelIdArray = args;
          const pushingIdtoDB = async (database) => {
               listChannelIdArray.forEach((element) => {
                    const channelObject = message.guild.channels.cache.find(channel => channel.id === element); // Gets the channel object
                    if (channelObject.type === ChannelType.GuildText) {
                         database.chatChannelId.push(element);
                    } else if (channelObject.type === ChannelType.GuildVoice) {
                         database.voiceChannelId.push(element);
                    } else return;
               })
               await database.save();
          }
          if (extraChannelData) {
               pushingIdtoDB(extraChannelData);
          } else {
               extraChannelData = new extraChannelModel({ guildId: message.guild.id });
               pushingIdtoDB(extraChannelData);
          }

          await message.reply("Đã thêm thành công id channel này vào: ", args.join(" "))
     }
}