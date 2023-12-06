const { ActivityType, EmbedBuilder } = require('discord.js');
const xoSoModel = require('../../database/models/xoSoModel.js');
const xoSoUserModel = require('../../database/models/xoSoUserModel.js');


const status = [
     {
          name: 'Youtube 🎧',
          type: ActivityType.Streaming,
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
     },
     {
          name: 'Spotify 🎧',
          type: ActivityType.Streaming,
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
     },
     {
          name: 'soundCloud 🎧',
          type: ActivityType.Streaming,
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
     },
     // {
     //   name: 'Custom Status 3',
     //   type: ActivityType.Listening,
     // },
];

/**
 * 
 * @param {import('discord.js').Client} client 
 */

module.exports = async (client) => {
     require('../../database/mongoose.js').initializeMongoose()
          .then(() => {
               console.log("✅ Successfully accessed to databases");
               console.log(`✅ Sucessfully logged into ${client.user.tag}!.`);

               setInterval(() => {
                    const random = Math.floor(Math.random() * status.length);
                    client.user.setActivity(status[random]);
               }, 10000)
          });

     setInterval(() => {
          generateLottery();
     }, 60 * 15 * 1000); // cho 10 phút xổ số 1 lần

     const generateLottery = async () => {

          try {
               class xoSoKienThiet {

                    constructor(cacSoTrungThuong = [], soGiaiTrungTatca = 0) {
                         this.cacSoTrungThuong = cacSoTrungThuong;
                         this.soGiaiTrungTatca = soGiaiTrungTatca;
                    }
                    setCacSoTrungThuong(...args) {
                         args.forEach((element) => this.cacSoTrungThuong.push(element))

                    }
                    getCacSoTrungThuong() {
                         return this.cacSoTrungThuong.map((num, index) => `> **${index == 0 ? `Giải Đặc Biệt` : index == 1 ? `Giải Nhất` : index == 2 ? 'Giải Nhì' : index == 3 ? 'Giải Ba' : 'Giải Khuyến khích'} :** \`${num}\``)
                              .join('\n');
                    }
                    getSoGiaiTrungTatca() {
                         return `\`\`\`css\n Có tất cả là ${this.soGiaiTrungTatca} giải trúng\`\`\``;
                    }
               }
               const xoSoObject = new xoSoKienThiet();

               const giaiDB = Math.floor(Math.random() * (1e6 - 1e5)) + 1e5;
               const giaiNhat = Math.floor(Math.random() * (1e5 - 1e4) + 1e4);
               const giaiNhi = Math.floor(Math.random() * (1e4 - 1e3) + 1e3);
               const giaiBa = Math.floor(Math.random() * (1e3 - 1e2) + 1e2);
               const giaiKK = Math.floor(Math.random() * (1e2 - 1e1) + 1e1);

               xoSoObject.setCacSoTrungThuong(giaiDB, giaiNhat, giaiNhi, giaiBa, giaiKK);

               const xoSoData = await xoSoModel.findOne();
               const channel = client.guilds.cache.get("1080521432032882698").channels.cache.get("1080521432032882700");

               if (xoSoData) {
                    xoSoData.giaiDB = giaiDB;
                    xoSoData.giaiNhat = giaiNhat;
                    xoSoData.giaiNhi = giaiNhi;
                    xoSoData.giaiBa = giaiBa;
                    xoSoData.giaiKK = giaiKK;
                    await xoSoData.save();


                    const UserIdArray = xoSoData.userId;
                    for (const userId of UserIdArray) {
                         const userData = await xoSoUserModel.findOne({ userId: userId });
                         if (!userData) continue;
                         const xosoArray = userData.soLuong;

                         const [trungGiaiDb, trungGiaiNhat, trungGiaiNhi, trungGiaiBa, trungGiaiKK] = [
                              xosoArray.filter(value => value == xoSoData.giaiDB),
                              xosoArray.filter(value => value.slice(-5) == xoSoData.giaiNhat),
                              xosoArray.filter(value => value.slice(-4) == xoSoData.giaiNhi),
                              xosoArray.filter(value => value.slice(-3) == xoSoData.giaiBa),
                              xosoArray.filter(value => value.slice(-2) == xoSoData.giaiKK)
                         ];

                         if (trungGiaiDb.length > 0) {
                              await channel.send(`Chúc mừng <@${userId}> đã trúng \`${trungGiaiDb.length}\` **giải đặc biệt**`);
                         }
                         if (trungGiaiNhat.length > 0) {
                              await channel.send(`Chúc mừng <@${userId}> đã trúng \`${trungGiaiNhat.length}\` **giải nhất**`)
                         }
                         if (trungGiaiNhi.length > 0) {
                              await channel.send(`Chúc mừng <@${userId}> đã trúng \`${trungGiaiNhi.length}\` **giải Nhì**`)
                         }
                         if (trungGiaiBa.length > 0) {
                              await channel.send(`Chúc mừng <@${userId}> đã trúng \`${trungGiaiBa.length}\` **giải Ba**`)
                         }
                         if (trungGiaiKK.length > 0) {
                              await channel.send(`Chúc mừng <@${userId}> đã trúng \`${trungGiaiKK.length}\` **giải khuyến khích**`)
                         }
                         xoSoObject.soGiaiTrungTatca += trungGiaiDb.length + trungGiaiNhat.length + trungGiaiBa.length + trungGiaiKK.length;
                         console.log("Đã xóa user");
                         await userData.deleteOne();
                    }
                    await xoSoData.deleteOne();
               }

               const cacSoTrungThuongEmbed = new EmbedBuilder()
                    .setTitle('CÁC SỐ TRÚNG THƯỞNG')
                    .setDescription(`${xoSoObject.getCacSoTrungThuong()} \n ${xoSoObject.getSoGiaiTrungTatca()}`)
                    .setColor('Gold')
                    .setTimestamp()
               await channel.send({ embeds: [cacSoTrungThuongEmbed] }).then((msg) => setTimeout(() => msg.delete(), 60 * 15 * 1000));

               delete xoSoObject;
               
          } catch (error) {
               console.log("There was an error in lotteryGenerator: ", error);
          }
     }

};