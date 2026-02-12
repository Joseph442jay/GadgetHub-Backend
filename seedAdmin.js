const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const USER = require("./Models/User"); // adjust path if needed
require("dotenv").config();

async function seedAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 30000, // 30s timeout
    });
    console.log("✅ Connected to MongoDB");

    const email = "jjaysuyon@yahoo.com";
    const phoneNumber = "07062558681";
    const password = "Joseph@442";

    const existingAdmin = await USER.findOne({ email });

    if (existingAdmin) {
      // Admin exists – update password just in case
      const hashedPassword = await bcrypt.hash(password, 10);
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log("⚡ Admin already exists – password updated!");
    } else {
      // Admin does not exist – create new
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = new USER({
        firstName: "Admin",
        lastName: "JAYJAY",
        email,
        phoneNumber,
        password: hashedPassword,
        role: "admin",
      });
      await admin.save();
      console.log("✅ Admin seeded successfully!");
    }
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seedAdmin();
