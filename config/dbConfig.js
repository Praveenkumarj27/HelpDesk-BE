const mongodb = require('mongodb')
const dotenv=require('dotenv').config()
const dbName = process.env.DB_NAME;
const MongoClient=mongodb.MongoClient;
const dbUrl=`${process.env.URL}/${process.env.DB_NAME}`



module.exports ={mongodb,dbName,dbUrl,MongoClient}
