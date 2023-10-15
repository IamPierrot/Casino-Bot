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
               "Level": ':green_book:',
               "Config": ':tools:',
               "Music" : ':cd:',
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