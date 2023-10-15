const { EmbedBuilder } = require('discord.js')
/**
 * 
 * @param {import('discord.js').Client} client 
 */

module.exports = (client) => {
     client.checkIdRequest = (track, userId) => {
          if (track.requestedBy.id !== userId) {
               return new EmbedBuilder()
                    .setAuthor({ name: `❌ Có lỗi khi yêu cầu dừng/bỏ qua bài hát` })
                    .setDescription(`Bài hát này là yêu cầu của : ${track.requestedBy.toString()}`)
          } else {
               return false;
          }
     }
}