const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');
const getAllFile = require('../../utils/getAllFiles');
const path = require('path');

module.exports = {
     name: 'help',
     description: "xem tất cả lệnh mà em đang có",
     showHelp: false,

     callback: async (client, message, args) => {

          const commandFolders = getAllFile(path.join(__dirname, '..'), true)
               .map((value) => value.split("\\").pop().split('.').shift());
          function createSelectMenuOption(categoryName) {
               let result = [];
               for (const category of categoryName) {
                    const optionMenu = new StringSelectMenuOptionBuilder()
                         .setDescription(`Xem các lệnh về ${category}!`)
                         .setLabel(category)
                         .setValue(category)
                    result.push(optionMenu);
               }
               return result
          }
          const emoji = {
               "Config": '<:mod:1129124907511459900>',
               "Level": ':green_book:',
               "Music": ':cd:',
               "Economy": '<a:coin_flip:1163073855540187177>',
               "Admin": '<:Moderators:1129122776800821259>',
               "Lottery": '<:sunset_ticket:1163103914745397328> ',
               "Game": '<:die_dice_d671:1163103917979213946>'
          };


          const menu = new StringSelectMenuBuilder()
               .setCustomId('help')
               .setPlaceholder('Help menu')
               .setMinValues(1)
               .setMaxValues(1)
               .addOptions(createSelectMenuOption(commandFolders));
          const row1 = new ActionRowBuilder().addComponents(menu);
          
          const helpString = commandFolders.map((value) => {
               return `> ${emoji[value]} \`:\` **${value}** `
          }).join("\n");

          const embed = new EmbedBuilder()
               .setColor('Fuchsia')
               .setAuthor({ name: "BẢNG LỆNH LOLI BOT" })
               .setDescription(`Chào mừng ${message.author.toString()} đến với sở thú||LOLI||. \n Bot được phát triển bởi <@479182625764802560> và <@874321270437728257>`)
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