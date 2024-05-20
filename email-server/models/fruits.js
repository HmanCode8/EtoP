const mongoose = require("mongoose");

// interface FruitItem {
//   name: string;
//   description: string;
//   color: string;
// userId,
// username
// }

const fruitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

const Fruit = mongoose.model("Fruit", fruitSchema);

module.exports = Fruit;