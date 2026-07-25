import "dotenv/config";
import mongoose from "mongoose";
import Admin from "../src/modules/auth/auth.model.js";
import {connectDB} from "../src/config/db.js";
import bcrypt from "bcryptjs";

const seedAdmin = async () => {
  try {
    await connectDB();

    const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (existing) {
      console.log("Admin already exists:", existing.email);
      process.exit(0);
    }

    const hashPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)

    const admin = await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: hashPassword,
      phoneNumber: process.env.ADMIN_PHONE_NUMBER,
    });

    console.log("Admin created successfully:", admin.email);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
