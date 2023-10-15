const { EmbedBuilder } = require('discord.js');
const getTextCommands = require('../../utils/getTextCommands.js');
const prefixModel = require('../../database/models/prefixModel.js');


/**
 * 
 * @param {import('discord.js').Message} message 
 */

module.exports = async (client, message) => {
     try {

          global.prefix = "!";
          let data = await prefixModel.findOne({ guildId: message.guildId })

          if (data && !message.content.toLowerCase().startsWith(prefix.toLowerCase())) {
               prefix = data.prefix;
          }

          if (message.author.bot || !message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;

          const textCommands = getTextCommands();

          const args = message.content.slice(prefix.length).trim().split(/ +/);
          const command = args.shift().toLowerCase();

          const commandObject = await textCommands.find(
               (cmd) => cmd.name === command || cmd.aliases?.includes(command)
          );

          if (!commandObject) return;

          if (commandObject.adminOnly && !configure.opt.idDev?.includes(message.author.id)) return message.reply("Bạn không có quyền dùng lệnh này!");

          if (commandObject.voiceChannel) {
               if (!message.member.voice.channel) return await message.reply({ embeds: [new EmbedBuilder().setColor('#ff0000').setDescription(`❌ | Bạn đang không ở trong phòng Voice`)], ephemeral: true, })
               if (message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return await message.reply({ embeds: [new EmbedBuilder().setColor('#ff0000').setDescription(`❌ | Bạn đang không ở cùng phòng voice với tui! `)], ephemeral: true, })
          }

          await commandObject.callback(client, message, args);
     } catch (error) {
          console.log("There was an error in messageCreate: ", error);
     }
}