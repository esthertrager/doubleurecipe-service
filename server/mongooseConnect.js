const mongoose = require('mongoose');
mongoose.connect('mongodb://@127.0.0.1:27017/dur');



const mongooseConnect = () => {
  return new Promise((resolve, reject) => {

    const db = mongoose.connection;
    db.on('error', (error) => {
      console.error('Failed to connect to mongo', error);
      reject(error);
    });

    db.once('open', () => {
      console.log('Connected to mongodb');
      resolve({})
    });
  });
  
}

module.exports = mongooseConnect;