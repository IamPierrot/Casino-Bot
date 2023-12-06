const chatLevelModel = require('../../database/models/chatLvModel.js');
const voiceLevelModel = require('../../database/models/voiceLvModel.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
     name: "toplevel",
     description: 'Xem bảng xếp hạng Level',
     aliases: ['rank'],


     callback: async (client, message, args) => {
          const [chatData, voiceData] = await Promise.all([
               await chatLevelModel.find({ guildId: message.guildId }).sort({ level: -1 }),
               await voiceLevelModel.find({ guildId: message.guildId }).sort({ level: -1 })
          ]);

          const maxCount = args[0] ? args[0] : 10;
          const getIndex = (rank, object, index) => { object.userId == message.author.id ? rank = index : rank; return rank; };

          const rankChatLevel = chatData.reduce(getIndex, -1);
          const rankVoiceLevel = voiceData.reduce(getIndex, -1);

          let descriptionOfChat = chatData
               .slice(0, maxCount)
               .map((data, index) => { return `**${index + 1}.** <@${data.userId}> | **Cấp độ Chat** \`:\` \`${data.level}\`` })
               .join('\r\n\r\n');
          let descriptionOfVoice = voiceData
               .slice(0, maxCount)
               .map((data, index) => { return `**${index + 1}.** <@${data.userId}> | **Cấp độ Voice** \`:\` \`${data.level}\`` })
               .join('\r\n\r\n');

          const leaderboardOfChat = new EmbedBuilder()
               .setAuthor({ name: `Bảng Xếp Hạng Chat`, iconURL: message.author.displayAvatarURL() })
               .setDescription(descriptionOfChat)
               .setColor('#2f3136')
               .setTimestamp()
               .setFooter({ text: `Xếp hạng của bạn #${rankChatLevel !== -1 ? rankChatLevel + 1 : 'unranked'}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          const leaderboardOfVoice = new EmbedBuilder()
               .setAuthor({ name: `Bảng Xếp Hạng Voice`, iconURL: message.author.displayAvatarURL() })
               .setDescription(descriptionOfVoice)
               .setColor('#2f3136')
               .setTimestamp()
               .setFooter({ text: `Xếp hạng của bạn #${rankVoiceLevel !== -1 ? rankVoiceLevel + 1 : 'unranked'}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })


          await message.reply({ embeds: [leaderboardOfChat, leaderboardOfVoice] });
     }
}