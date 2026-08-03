import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log("Testing DNS resolution for _mongodb._tcp.wpdbms.tjvixh1.mongodb.net ...");
dns.resolveSrv('_mongodb._tcp.wpdbms.tjvixh1.mongodb.net', (err, addresses) => {
  if (err) {
    console.error("❌ DNS SRV Resolution Failed:", err.message);
  } else {
    console.log("✅ SRV Records Found:", addresses);
  }
});

const uri = process.env.MONGODB_URI;
console.log("Connecting with URI:", uri ? uri.replace(/([^:]+):([^@]+)@/, '$1:****@') : "MISSING");

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("🎉 SUCCESS! Connected to MongoDB Atlas!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Connection failed error name:", err.name);
    console.error("❌ Full error message:", err.message);
    process.exit(1);
  });
