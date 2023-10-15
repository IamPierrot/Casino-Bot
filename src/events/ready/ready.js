const { ActivityType } = require('discord.js');

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

module.exports = (client) => {
     require('../../database/mongoose.js').initializeMongoose()
          .then(() => {
               console.log("✅ Successfully accessed to databases");
               console.log(`✅ Sucessfully logged into ${client.user.tag}!.`);

               setInterval(() => {
                    let random = Math.floor(Math.random() * status.length);
                    client.user.setActivity(status[random]);
               }, 10000)

          });

};