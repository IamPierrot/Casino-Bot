const { } = require('discord.js');

module.exports = {
     name: 'coinflip',
     description: "chơi game tung đồng xu",
     aliases: ['cf'],

     /**
      * 
      * @param {import('discord.js').Client} client 
      * @param {import('discord.js').Message} message 
      * @param {*} args
      */
     callback: async (client, message, args) => {
          const author = message.author.id;
          const bal = await client.xemTien(author);
     
          let soTien = args[0] === 'all' ? Math.round(bal) : parseInt(args[0]) ?  parseInt(args[0]) : Math.round(bal * 0.25);
          let choose = args[1] ? args[1] : 'h'; // h hoăc t ;v

          if (soTien > bal) return message.reply("Deo du tien dau ma choi");
          if (soTien < 0) return message.reply("Deo duoc nhap so am");

          let rand = Math.round(Math.random()) == 1 ? 't' : 'h'; 
          let result = rand == choose ? await client.addTien(author, soTien * 2) : await client.truTien(author, soTien); 

          const statusCoin = {
               't': 'sấp',
               'h': 'ngửa'
          }

          await message.reply(`<a:coin_flip:1163073855540187177> Bạn cược **${soTien}** và chọn **${statusCoin[choose]}**...`)
               .then(msg => {
                    setTimeout(() => {
                         msg.channel.send(`Đồng xu **mặt ${statusCoin[rand]} và bạn ${rand == choose ? `thắng ${soTien * 2}` : 'mất hết rồi...'} **`);
                    }, 3000);
               })
     }
}