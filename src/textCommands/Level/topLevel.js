const chatLevelModel = require('../../database/models/chatLvModel.js');
const voiceLevelModel = require('../../database/models/voiceLvModel.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
     name: "toplevel",
     aliases: ['rank'],


     callback: async (client, message, args) => {
          let [chatData, voiceData] = await Promise.all([
               await chatLevelModel.find({ guildId: message.guildId }).sort({ level: -1 }),
               await voiceLevelModel.find({ guildId: message.guildId }).sort({ level: -1 })
          ]);

          let descriptionOfChat = chatData
               .slice(0, 10)
               .map((data, index) => { return `**${index + 1}.** <@${data.userId}> | **Cấp độ Chat** : ${data.level}` })
               .join('\r\n\r\n');
          let descriptionOfVoice = voiceData
               .slice(0, 10)
               .map((data, index) => { return `**${index + 1}.** <@${data.userId}> | **Cấp độ Voice** : ${data.level}` })
               .join('\r\n\r\n');

          const leaderboardOfChat = new EmbedBuilder()
               .setAuthor({ name: `Bảng Xếp Hạng Chat`, iconURL: message.author.displayAvatarURL() })
               .setDescription(descriptionOfChat)
               .setColor('#2f3136')
               .setTimestamp()
               .setFooter({ text: 'Âm nhạc đi trước - Tình yêu theo sau ❤️', iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          const leaderboardOfVoice = new EmbedBuilder()
               .setAuthor({ name: `Bảng Xếp Hạng Voice`, iconURL: message.author.displayAvatarURL() })
               .setDescription(descriptionOfVoice)
               .setColor('#2f3136')
               .setTimestamp()
               .setFooter({ text: 'Âm nhạc đi trước - Tình yêu theo sau ❤️', iconURL: message.author.displayAvatarURL({ dynamic: true }) })


          await message.reply({ embeds: [leaderboardOfChat, leaderboardOfVoice] });
     }
}