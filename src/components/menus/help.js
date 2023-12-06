const { EmbedBuilder } = require('discord.js');
const path = require('path');
const sourceEmoji = require('../../database/data/emoji.json');

module.exports = async ({ client, interaction, values }) => {
     await interaction.deferReply({ ephemeral: true })
     const commandCategoriesPaths = client.getFiles(
          path.join(__dirname, '..', '..', 'textCommands'),
          true
     );

     function createEmbedForCommand(category) {
          const commandObjects = [];
          const commandCategories = commandCategoriesPaths.filter(value => value.split("\\").pop() === category);
          for (const commandCategory of commandCategories) {
               const commandFiles = client.getFiles(commandCategory);

               for (const commandFile of commandFiles) {
                    const commandObject = require(commandFile);
                    if (commandObject?.showHelp === false) continue;
                    commandObjects.push(commandObject);
               }
          }

          const fields = (commandObject) => {

               return commandObject.map(element => {
                    return {
                         name: `**Cách dùng** : \`${configure.app.prefix} ${element.name} ${element?.tips ? element.tips : ''}\` ${element?.adminOnly ? `<:Moderators:1129122776800821259>` : ''}`,
                         value: `${element.description} - Các lệnh rút gọn : \`${element?.aliases ? element.aliases : "Không có"}\``,
                         inline: false
                    }
               })
          }
          const nameOfCommand = (commandObject) => {
               return commandObject.map(element => `\`${element.name}\``).join(' , ')
          }

          const emoji = sourceEmoji.emoji;


          const resultEmbed = new EmbedBuilder()
               .setTitle(`${emoji[category]} ${category} - (${commandObjects.length}) ${nameOfCommand(commandObjects)}`)
               .addFields(fields(commandObjects))
               .setTimestamp()
               .setFooter({ text: `Prefix của bot là ${configure.app.prefix}`, iconURL: client.user.displayAvatarURL() });
          return resultEmbed;
     }

     await interaction.editReply({ embeds: [createEmbedForCommand(values[0])], ephemeral: true });

}