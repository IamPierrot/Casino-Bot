const {} = require('discord.js');

module.exports = {
     name: 'add',
     adminOnly: true,

     /**
      * 
      * @param {import('discord.js').Client} client 
      * @param {import('discord.js').Message} message 
      * @param {*} args
      */
     callback: async (client, message, args) => {
          let toGiveUser = message.mentions.members.first() || message.guild.members.cache.find((u) => u.id === args[0] || u.user.username === args[0]);
          const soTien = parseInt(args[1]);
          const author = message.author.id;
          await client.addTien(toGiveUser.id, soTien);
          await message.reply(`Đã add cho người dùng ${soTien}`);
     }
}