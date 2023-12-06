const { EmbedBuilder, Client, Message } = require("discord.js");
const xoSoUserModel = require('../../database/models/xoSoUserModel');
const xoSoModel = require('../../database/models/xoSoModel')

module.exports = {
     name: "muaveso",
     aliases: ["mvs"],
     description: "Mua vé số",
     /**
      * 
      * @param {Client} client 
      * @param {Message} message 
      * @param {*} args 
      * @param {*} userData 
      * @returns 
      */
     callback: async (client, message, args) => {
          const price = 10000;

          const amount = parseInt(args[0]) ? parseInt(args[0]) : 1000;
          if (amount < 0) return message.reply('Rốt cuộc muốn mua nhiêu?')
          // if (amount > 10) return message.reply('Bạn chỉ có thể mua tối đa 10 vé')

          let userData = await xoSoUserModel.findOne({
               userId: message.author.id
          })
          let data = await xoSoModel.findOne()
          if (!data) data = new xoSoModel({ userId: [] })

          data.userId.push(message.author.id)

          if (!userData) userData = new xoSoUserModel({ userId: message.author.id, soLuong: [] })

          const arr = userData.soLuong

          // if (arr.length >= 10) return message.reply('Bạn đã sở hữu 10 vé số rồi!')

          if (await client.xemTien(message.author.id) < (price * amount)) return message.reply("Không có tiền đòi chơi vé số!!!")
          await client.truTien(message.author.id, price * amount)

          for (let i = 0; i < amount; i++) {
               arr.push(Math.floor(Math.random() * (1e6 - 1e5)) + 1e5);
          }
          await userData.save();
          await data.save();

          const success = arr
               ? new EmbedBuilder().setDescription(
                    `**Bạn đã mua thành công ${amount} vé số với giá ${amount * price} <:O_o:1135831601205481523> coins**`
               ).setColor('Green')
               : new EmbedBuilder().setAuthor({ name: `Có lỗi khi mua hàng!` });
          await message.reply({ embeds: [success] });
     },
};