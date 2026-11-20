import mongoose from "mongoose";
import dns from "dns";

// Fix for Windows / ISP DNS resolution issues with SRV records
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
    // fallback to system dns
}

let isConnected = false;

const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState === 1) {
        return;
    }
    try {
        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI is missing in .env file");
            return;
        }
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log('mongodb connected successfully');
    } catch (error) {
        console.error("Could not connect to MongoDB:", error.message);
        if (error.message.includes("ENOTFOUND")) {
            console.error("\n👉 REASON: The cluster domain in MONGO_URI does not exist on MongoDB Atlas (NXDOMAIN) or has expired/been deleted.");
            console.error("To fix this:");
            console.error("1. Open https://cloud.mongodb.com");
            console.error("2. Go to your active Cluster -> click 'Connect' -> 'Drivers'");
            console.error("3. Copy the connection string and paste it into Backend/.env as MONGO_URI\n");
        } else {
            console.error("Tip: Check if your IP is whitelisted in MongoDB Atlas (Network Access -> Add IP Address -> Allow Access from Anywhere 0.0.0.0/0)");
        }
    }
}
export default connectDB;
