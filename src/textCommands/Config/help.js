const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');
const path = require('path');
const sourceEmoji = require('../../database/data/emoji.json');


module.exports = {
     name: 'help',
     description: "xem tất cả lệnh mà em đang có",
     aliases: ['cuutoivoi', 'cuutoi', 'h'],
     showHelp: false,

     callback: async (client, message, args) => {
          const emoji = sourceEmoji.emoji;
          const emojiId = sourceEmoji.emojiId;

          const commandFolders = client.getFiles(path.join(__dirname, '..'), true)
               .map((value) => value.split("\\").pop().split('.').shift());
               
          function createSelectMenuOption(categoryName) {
               let result = [];
               for (const category of categoryName) {
                    const optionMenu = new StringSelectMenuOptionBuilder()
                         .setDescription(`Xem các lệnh về ${category}!`)
                         .setLabel(category)
                         .setValue(category)
                    if (emojiId?.[category]) {
                         optionMenu.setEmoji(emojiId?.[category])
                    }
                    
                    result.push(optionMenu);
               }
               return result
          }

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
          const prefixData = await client.getPrefix(message.guildId);
          const embed = new EmbedBuilder()
               .setColor('Fuchsia')
               .setAuthor({ name: "BẢNG LỆNH LOLI BOT" })
               .setTitle(`Prefix thay thế của máy chủ ${prefixData ? prefixData.prefix : 'Không có' }`)
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
               .setFooter({ text: `Prefix của bot là ${configure.app.prefix}` });

          client.components.set(message.author.id, menu.data.custom_id);

          await message.reply({ embeds: [embed], components: [row1] });
     },
};