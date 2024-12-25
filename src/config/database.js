const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://malikgrd786:malikgrd786@namastenode.dpa3l.mongodb.net/devTinder"
  );
};

module.exports = connectDb;


