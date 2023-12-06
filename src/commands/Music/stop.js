const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
     name: 'stop',
     description: 'dùng player đang phát',
     deleted: false,
     voiceChannel: true,

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
                    return await interaction.editReply({ embeds: [check] })
               } else {

                    queue.delete();

                    const stopEmbed = new EmbedBuilder()
                         .setColor('#b72563')
                         .setAuthor({ name: 'Nhà ngươi đã cho ta ngừng hát 🤬', iconURL: interaction.user.avatarURL() })

                    await interaction.editReply({ embeds: [stopEmbed] });

               }

          } catch (error) {
               console.log('There was an error in stop command: ', error);
          }

     },
}