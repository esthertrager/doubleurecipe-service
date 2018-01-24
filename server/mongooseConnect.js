const mongoose = require('mongoose');
const uri = 'mongodb://localhost/dur';
const options = {
  useMongoClient: true,
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 1000,
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};

const mongooseConnect = () => {
  return mongoose.connect(uri).then(
    () => {
      console.log('Connected to mongodb');
    },
    (error) => {
      console.error('Failed to connect to mongo', error);
    }
  );
}

module.exports = mongooseConnect;