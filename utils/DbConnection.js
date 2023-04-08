const mongoose = require("mongoose");

module.exports = async () => {
  try {
    const URI = process.env.DATABASE_URI;
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connected");
  } catch (err) {
    console.log(err.message);
  }
};
