const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
let connection;

const mongoConnect = () => {
  return new Promise((resolve, reject) => {
    if (connection) {
      resolve(connection);
      return;
    }

    console.log('Connecting to mongodb');

    MongoClient.connect('mongodb://@127.0.0.1:27017/dur', function(error, _connection) {
      if(error) {
        console.log('Failed to connect to mongodb', error);
        reject(error);
        return;
      }

      console.log('Connected to mongodb');
      connection = _connection;
      resolve(connection);
    });
  });
  
}

module.exports = mongoConnect;