const {} = require('discord.js');

module.exports = {
     name: 'give',
     description: "Chuyển tiền cho người khác!",
     tips: "+ @ten + số tiền",
     aliases: ['pay'],
     /**
      * 
      * @param {import('discord.js').Client} client 
      * @param {import('discord.js').Message} message 
      * @param {*} args
      */
     callback: async (client, message, args) => {
          const author = message.author.id;
          let toGiveUser = message.mentions.users.first();
          let soTien = parseInt(args[1]);
          const bal = await client.xemTien(author);

          if (soTien < 0) return message.reply("Bạn không thể nhập số tiền âm");
          if (soTien > bal) return message.reply("Nghèo còn bày đặt đi cho tiền người khác");

          await client.truTien(author, soTien);
          await client.addTien(toGiveUser.id, soTien);
          await message.reply(`Đã chuyển cho ${toGiveUser} ${soTien}`);
     }
}