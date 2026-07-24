import "dotenv/config";
import mongoose from "mongoose";
import Admin from "../models/admin.model.js";
import {connectDB} from "../src/config/db.js";

const seedAdmin = async () => {
  try {
    await connectDB();

    const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (existing) {
      console.log("Admin already exists:", existing.email);
      process.exit(0);
    }

    const admin = await Admin.create({
      email: process.env.EMAIL,
      password: process.env.PASSWORD,
    });

    console.log("Admin created successfully:", admin.email);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
