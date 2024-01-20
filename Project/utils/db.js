const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;
const URL = process.env.MONDODB_URL;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://diwashb999:1TiM933AXXGbMaRW@cluster0.ud0ibsu.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("CONNECTED TO DATABASE!");
      _db = client.db();
      callback(client);
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "NO DATABASE FOUND";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
