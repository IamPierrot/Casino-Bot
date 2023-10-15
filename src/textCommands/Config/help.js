const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');
const getAllFile = require('../../utils/getAllFiles');
const path = require('path');

module.exports = {
     name: 'help',
     description: "xem tất cả lệnh mà em đang có",
     showHelp: false,

     callback: async (client, message, args) => {

          const menu = new StringSelectMenuBuilder()
               .setCustomId('help')
               .setPlaceholder('Help menu')
               .setMinValues(1)
               .setMaxValues(1)
               .addOptions(
                    new StringSelectMenuOptionBuilder()
                         .setDescription("Xem các lệnh về level!")
                         .setLabel('Level')
                         .setValue('Level'),
                    new StringSelectMenuOptionBuilder()
                         .setDescription('Xem các lệnh về config!')
                         .setLabel('Config')
                         .setValue('Config'),
                    new StringSelectMenuOptionBuilder()
                         .setDescription("Xem các lệnh về music!")
                         .setLabel('Music')
                         .setValue('Music')
               );
          const row1 = new ActionRowBuilder().addComponents(menu);

          const commandFolders = getAllFile(path.join(__dirname, '..'), true)
               .map((value) => value.split("\\").pop().split('.').shift());

          const emoji = {
               "Config": ':tools:',
               "Level": ':green_book:',
               "Music": ':cd:'
          };
          const helpString = commandFolders.map((value) => {
               return `> ${emoji[value]} \`:\` **${value}** `
          }).join("\n");

          const embed = new EmbedBuilder()
               .setColor('Fuchsia')
               .setAuthor({ name: "BẢNG LỆNH LOLI BOT" })
               .setDescription(`Chào mừng ${message.author.toString()} đến với thiên đường ||LOLI||. \n Bot được phát triển bởi <@479182625764802560>`)
               .addFields([
                    {
                         name: `- Các loại lệnh của Bot \n `,
                         value: helpString,
                         inline: false
                    }
               ])
               .setThumbnail(client.user.displayAvatarURL())
               .setTimestamp()
               .setFooter({ text: 'Yêu em là chuyện của tôi 💔' });

          await message.reply({ embeds: [embed], components: [row1] });
     },
};