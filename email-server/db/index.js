const mongoose = require('mongoose')
const { db } = require('../config')

const connectToDatabase = async () => {
  try {
    await mongoose.connect(`mongodb://${db.host}:${db.port}/${db.name}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('Connected to MongoDB is success')
  } catch (err) {
    console.error('Error connecting to MongoDB:', err)
  }
}

module.exports = connectToDatabase
