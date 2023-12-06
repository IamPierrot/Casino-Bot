const { useMainPlayer, useQueue, QueueRepeatMode } = require('discord-player');
const { EmbedBuilder } = require('discord.js');


module.exports = {
     name: 'skip',
     description: 'bỏ qua bài hát hiện tại',
     deleted: false,
     voiceChannel: true,

     /**
      * 
      * @param {*} client 
      * @param {import('discord.js').ChatInputCommandInteraction} interaction 
      * @returns 
      */

     callback: async (client, interaction) => {
          try {
               const queue = useQueue(interaction.guild);

               if (!queue || !queue.isPlaying()) {
                    const noMusic = new EmbedBuilder()
                         .setAuthor({ name: 'Không có gì đang phát ấy ? thử lại ikkk.... ❌' })

                    return await interaction.editReply({ embeds: [noMusic], ephemeral: true });
               }

               const check = client.checkIdRequest(queue.currentTrack, interaction.user.id);

               if (check) {
                    return await interaction.editReply({ embeds: [check], ephemeral: true })
               } else {
                    queue.setRepeatMode(QueueRepeatMode.OFF);
                    queue.node.skip();

                    const skipEmbed = new EmbedBuilder()
                         .setAuthor({ name: `⏭ Đã bỏ qua bài nhạc đang phát ${queue.currentTrack.title} ` });

                    await interaction.editReply({ embeds: [skipEmbed] });
               }

          } catch (error) {
               console.log('There was an error in skip command : ', error);
          }
     }
};