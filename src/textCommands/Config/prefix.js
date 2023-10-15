const prefixModel = require('../../database/models/prefixModel');

module.exports = {
     name: "changepre",
     aliases: ["cp"],
     description: 'thay đổi prefix cho máy chủ hiện tại',
     permissions: true,

     callback: async (client, message, args) => {
          let data = await prefixModel.findOne({ guildId: message.guildId });
          const newPrefix = args[0];
          const oldPrefix = data.prefix;
          if (data) {
               data.prefix = newPrefix;
          } else {
               data = new prefixModel({ prefix: newPrefix, guildId: message.guildId });
          }
          await data.save();

          await message.reply(`Đã thay đổi prefix cho máy chủ hiện tại từ \`${oldPrefix}\` thành \`${newPrefix}\``);

     }
}