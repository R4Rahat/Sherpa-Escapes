// import "dotenv/config";
// import Admin from "../../models/admin.model.js";
// import { connectDB } from "./db.js";

// export const seedAdmin = async () => {
//   try {
//     await connectDB();

//     const existing = await Admin.findOne({ email: process.env.EMAIL });
//     if (existing) {
//       console.log("Admin already exists");
//       return;
//     }

//     const admin = await Admin.create({
//       email: process.env.EMAIL,
//       password: process.env.PASSWORD,
//     });
//     console.log("Admin created successfully");
//     process.exit(0);
//   } catch (error) {
//     console.log(error);
//   }
// // 
