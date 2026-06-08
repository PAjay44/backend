const { mongoose } = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namastedev:6NYQpoc0umRDQptl@namastenode.pkth1.mongodb.net/devTinder",
  );
  // through mongoose.connect we connect with cluster in URL , after / we have to give database name.
};

module.exports = connectDB;
