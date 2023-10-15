const mongoose = require('mongoose');
const mongodbURI = configure.MONGO;

module.exports = {
     async initializeMongoose() {
          console.log('Đang kết nối với MongoDB...');

          try {
               await mongoose.connect(mongodbURI, {
                    dbName: "Levels",
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
               })
          } catch (error) {
               console.log('Không kết nối được với database', error);
               process.exit(1)
          }
     }
}