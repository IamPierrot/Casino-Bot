const { EmbedBuilder } = require("discord.js");
const { QueueRepeatMode, useQueue } = require('discord-player');

module.exports = {
     name: 'skip',
     description: 'bỏ qua bài em đang hát',
     voiceChannel: false,

     /**
      * 
      * @param {import('discord.js').Client} client 
      * @param {import('discord.js').Message} message 
      * @param {*} args 
      * @returns 
      */

     callback: async (client, message, args) => {
          try {
               const queue = useQueue(message.guild);
               const noMusic = new EmbedBuilder()
                    .setAuthor({ name: 'Không có gì đang phát ấy ? thử lại ikkk.... ❌' })
               if (!queue || !queue.isPlaying()) return await message.reply({ embeds: [noMusic] });
               
               const check = client.checkIdRequest(queue.currentTrack, message.author.id);
               if (check) {
                    return await message.reply({ embeds: [check], ephemeral: true });
               } else {
     
                    queue.setRepeatMode(QueueRepeatMode.OFF);
                    queue.node.skip();
     
                    const skipEmbed = new EmbedBuilder()
                         .setAuthor({ name: `⏭ Đã bỏ qua bài nhạc đang phát ${queue.currentTrack.title} ` });
     
                    await message.reply({ embeds: [skipEmbed] });
               }
               
          } catch (error) {
               console.log('There was an error in skip text command: ', error);
          }

     }

}    