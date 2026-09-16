const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// ponytail: iPhone-hotspot DNS returns malformed SRV replies (EBADRESP), which
// breaks mongodb+srv:// lookups. Pin a public resolver. Drop this once the Mac's
// system DNS is set to a resolver that handles SRV correctly.
dns.setServers(['1.1.1.1', '8.8.8.8']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
