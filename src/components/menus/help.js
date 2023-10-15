const { EmbedBuilder } = require('discord.js');
const getAllFiles = require('../../utils/getAllFiles.js');
const path = require('path');

module.exports = async ({ client, interaction, values }) => {
     await interaction.deferReply({ ephemeral: false })
     const commandCategoriesPaths = getAllFiles(
          path.join(__dirname, '..', '..', 'textCommands'),
          true
     );

     function createEmbedForCommand(category) {
          let commandObjects = [];
          const commandCategories = commandCategoriesPaths.filter(value => value.split("\\").pop() === category);
          for (const commandCategory of commandCategories) {
               const commandFiles = getAllFiles(commandCategory);

               for (const commandFile of commandFiles) {
                    const commandObject = require(commandFile);
                    commandObjects.push(commandObject);
               }
          }

          const fields = (commandObject) => {
               let result = [];

               commandObject.forEach(element => {
                    result.push({
                         name: `**Cách dùng** : \`${prefix}${element.name}\` ${element?.adminOnly ? `:x:` : ''}`,
                         value: `${element.description} - Các lệnh rút gọn : \`${element.aliases ? element.aliases : "Không có"}\``,
                         inline: false
                    })
               })

               return result;
          }
          const nameOfCommand = (commandObject) => {
               return commandObject.map(element => `\`${element.name}\``).join(' , ')
          }

          const emoji = {
               "Admin": "<:Moderators:1129122776800821259>",
               "Level": ':green_book:',
               "Config": '<:mod:1129124907511459900>',
               "Music" : ':cd:',
               "Economy": '<a:coin_flip:1163073855540187177>',
               "Lottery": '<:sunset_ticket:1163103914745397328>',
               "Game": '<:die_dice_d671:1163103917979213946>'
          }


          const resultEmbed = new EmbedBuilder()
               .setTitle(`${emoji[category]} ${category} - (${commandObjects.length}) ${nameOfCommand(commandObjects)}`)
               .addFields(fields(commandObjects))
               .setTimestamp()
               .setFooter({ text: `👻 Yêu em là chuyện của tôi <3`, iconURL: client.user.displayAvatarURL() });
          return resultEmbed;
     }

     await interaction.editReply({ embeds: [createEmbedForCommand(values[0])] });

}