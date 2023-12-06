const { ApplicationCommandOptionType, ChannelType } = require('discord.js')

module.exports = {
     name: "startlevel",
     description: "start and setup a level systems in guild",
     adminOnly: true,

     options: [
          {
               name: "channelname",
               description: "tên channel thông báo level",
               type: ApplicationCommandOptionType.String,
               require: true
          }
     ],
     /**
      * 
      * @param {*} client 
      * @param {import('discord.js').Interaction} interaction 
      */
     callback: async (client, interaction) => {
          await interaction.guild.channels.create({
               name: interaction.options.getString('channelname'),
               type: ChannelType.GuildText,
               reason: "Lmao hehe"
          });
          
          await interaction.editReply("Đã tạo thành công channel");
          
     }
}