const { InteractionType, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = async (client, interaction) => {
     try {
          if (interaction.type !== InteractionType.MessageComponent) return;

          if (interaction.isButton()) {

               const customId = interaction.customId;
               const buttonName = customId;

               const musicCustomId = JSON.parse(customId);
               const musicButtonName = musicCustomId.ffb;

               if (musicButtonName) {
                    const queue = useQueue(interaction.guild);
                    const noMusic = new EmbedBuilder()
                         .setAuthor({ name: 'Không có gì đang phát ấy ? thử lại ikkk.... ❌' })

                    if (!queue || !queue.isPlaying()) return await interaction.reply({ embeds: [noMusic] });

                    if (musicButtonName && interaction.user.id === queue.currentTrack.requestedBy.id) {
                         delete require.cache[require.resolve(`../../components/buttons/music/${musicButtonName}.js`)];
                         const button = require(`../../components/buttons/music/${musicButtonName}.js`);
                         if (button) await button({ client, interaction, customId, queue });
                    } else {
                         await interaction.reply({
                              embeds: [
                                   new EmbedBuilder()
                                        .setAuthor({ name: `❌ Mấy cái nút không phải dành cho bạn` })
                                        .setDescription(`Bài hát này là yêu cầu của : ${queue.currentTrack.requestedBy.toString()}`)
                              ],
                              ephemeral: true
                         }).then(() => setTimeout(() => interaction.deleteReply(), 10000))
                    }

               } else if (buttonName) {
                    delete require.cache[require.resolve(`../../components/buttons/${buttonName}.js`)];
                    const button = require(`../../components/buttons/${buttonName}.js`);
                    if (button) await button({ client, interaction, customId });
               }
          }

          if (interaction.isStringSelectMenu()) {
               const customId = interaction.customId;
               const values = interaction.values;
               const menuName = customId;

               if (menuName) {
                    delete require.cache[require.resolve(`../../components/menus/${menuName}.js`)]
                    const menu = require(`../../components/menus/${menuName}.js`);
                    if (menu) await menu({ client, interaction, values });
               }
          }

     } catch (error) {
          console.log(`There was an Error when running Button: ${error}`)
     }
}