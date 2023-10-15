const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const chatLevelModel = require('../../database/models/chatLvModel');
const voiceLevelModel = require('../../database/models/voiceLvModel');
const { duration } = require('moment');
require('moment-duration-format');
/////
module.exports = {
     name: "level",
     description: "xem level trong máy chủ hiện tại",
     /**
      * 
      * @param {import('discord.js').Client} client 
      * @param {import('discord.js').Message} message 
      * @param {*} args 
      */

     callback: async (client, message, args) => {
          let [chatData, voiceData] = await Promise.all([
               await chatLevelModel.findOne({ userId: message.author.id, guildId: message.guildId }),
               await voiceLevelModel.findOne({ userId: message.author.id, guildId: message.guildId })
          ])

          if (chatData && voiceData) {
               const durations = duration(voiceData.totalTime).format(" D [ngày], H [giờ], m [phút], s [giây]");
               const levelEmbeds = new EmbedBuilder()
                    .setAuthor({ name: `Máy Chủ ${message.guild.name}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setTitle(`Bảng Thông Tin Cấp Độ | ${message.author.username}`)
                    .setColor("Random")
                    .addFields(
                         {
                              name: `:speech_balloon: **CẤP ĐỘ TIN NHẮN** \n > :coin:  **Level chat hiện tại** : \`${chatData.level}\``,
                              value: `> :coin: **Kinh nghiệm hiện tại** : \`${chatData.xp} / ${chatData.nextLevel}\``,
                              inline: false
                         },
                         {
                              name: `:speaker: **CẤP ĐỘ VOICE** \n > :coin: **Level voice hiện tại** : \`${voiceData.level}\``,
                              value: `> :coin: **Kinh nghiệm hiện tại** : \`${voiceData.xp} / ${voiceData.nextLevel}\``,
                              inline: false
                         },
                         {
                              name: `:part_alternation_mark: **THÔNG SỐ** \n > :diamond_shape_with_a_dot_inside: **Tổng thời gian trong voice** : \`${durations}\` `,
                              value: `> :diamond_shape_with_a_dot_inside: **Tổng số từ đã nhắn** : \`${chatData.totalText}\``,
                              inline: false
                         }
                    )
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                    .setFooter({ text: `Yêu em là chuyện của tôi <3`, iconURL: client.user.avatarURL({ dynamic: true }) })
               /////////////////////////////////////////////
               await message.reply({
                    embeds: [levelEmbeds]
               });
          } else {
               return await message.reply("Không tìm thấy dữ liệu người dùng!");
          }
     }
}