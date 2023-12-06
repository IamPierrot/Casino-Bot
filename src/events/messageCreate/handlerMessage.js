const { EmbedBuilder, PermissionsBitField } = require('discord.js');

/**
 * 
 * @param {import('discord.js').Message} message 
 */

module.exports = async (client, message) => {
     try {
          if (message.author.bot) return;

          const prefixData = await client.getPrefix(message.guildId);
          global.prefix = configure.app.prefix;

          if (prefixData && !message.content.toLowerCase().startsWith(prefix.toLowerCase())) {
               prefix = prefixData.prefix;
          }

          if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;

          const textCommands = client.getPrefixCommands();

          const args = message.content.slice(prefix.length).trim().split(/ +/);
          const command = args.shift().toLowerCase();

          const commandObject = await textCommands.find(
               (cmd) => cmd.name === command || cmd.aliases?.includes(command)
          );

          if (!commandObject) return;

          if (commandObject?.adminOnly && (!configure.opt.idDev?.includes(message.author.id) || !message.member.permissions.has([PermissionsBitField.Flags.Administrator]))) return message.reply("Bạn không có quyền dùng lệnh này!");

          if (commandObject?.DJPermissions && (!message.member.permissions.has([PermissionsBitField.Flags.MoveMembers, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.MuteMembers]))) return message.reply("Bạn không có quyền dùng lệnh này!");
          if (commandObject?.voiceChannel) {
               if (!message.member.voice.channel) return await message.reply({ embeds: [new EmbedBuilder().setColor('#ff0000').setDescription(`❌ | Bạn đang không ở trong phòng Voice`)], ephemeral: true, })
               if (message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return await message.reply({ embeds: [new EmbedBuilder().setColor('#ff0000').setDescription(`❌ | Bạn đang không ở cùng phòng voice với tui! `)], ephemeral: true, })
          }

          await commandObject.callback(client, message, args);
     } catch (error) {
          console.log("There was an error in handler Commands: ", error);
     }
}