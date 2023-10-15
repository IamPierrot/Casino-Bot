const {} = require("discord.js");

module.exports = {
     name: 'balance',
     description: "xem số tiền hiện có trong túi" ,
     aliases: ['bal', 'cash', 'coin'],
     /**
      * 
      * @param {import('discord.js').Client} client 
      * @param {import('discord.js').Message} message 
      * @param {*} args
      */
     callback: async (client, message, args) => {
          const author = message.author.id;
          const balance = await client.xemTien(author);

          await message.reply(`Số tiền hiện tại của bạn: ${balance}`);
     }
}