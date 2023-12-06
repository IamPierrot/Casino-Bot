const extraChannelModel = require('../../database/models/extraChannels');
const { ChannelType } = require('discord.js')


module.exports = {
     name: "addextrachannel",
     aliases: ["addec", "ec"],
     description: "thêm kênh bonus exp",
     adminOnly: true,
     showHelp: false,

     callback: async (client, message, args) => {
          let extraChannelData = await extraChannelModel.findOne({ guildId: message.guild.id });
          const removeAliases = ["r", "remove", "xóa", "cook"];

          const isRemove = removeAliases.includes(args[args.length - 1]) ? (() => {
               args.pop();
               return true;
          })() : false;
          const listChannelIdArray = args;

          const pushingIdtoDB = async (database) => {
               const chatChannelIdArray = database.chatChannelId;
               const voiceChannelIdArray = database.voiceChannelId;

               listChannelIdArray.forEach(async (element) => {

                    const channelObject = message.guild.channels.cache.find(channel => channel.id === element); // Gets the channel object
                    if (channelObject.type === ChannelType.GuildText) {
                         if (isRemove) {
                              database.chatChannelId = chatChannelIdArray.filter((id) => id !== element);
                         } else {
                              if (chatChannelIdArray.includes(element)) return;
                              database.chatChannelId.push(element);
                         }

                    } else if (channelObject.type === ChannelType.GuildVoice) {
                         if (isRemove) {
                              database.voiceChannelId = voiceChannelIdArray.filter((id) => id != element);
                         } else {
                              if (voiceChannelIdArray.includes(element)) return;
                              database.voiceChannelId.push(element);
                         }

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

          isRemove ? await message.reply(`Đã xóa thành công id channel: ${args.map(elm => `<#${elm}>`).join(" ")}`) : await message.reply(`Đã thêm thành công id channel: ${args.map(elm => `<#${elm}>`).join(" ")} `);
     }
}