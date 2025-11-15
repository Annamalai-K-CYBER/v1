import mongoose from "mongoose";
import { NextResponse } from "next/server";

// DB connection
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "csbs_sync",
    });
    console.log("Connected (addemail)");
  }
}

// User model
const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    email1: String,
    password: String,
    role: String,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

// ✅ POST /api/addemail
export async function POST(req) {
  try {
    await connectDB();

    const { email, email1 } = await req.json(); // existing email + new secondary email

    if (!email || !email1) {
      return NextResponse.json(
        { success: false, message: "email and email1 are required" },
        { status: 400 }
      );
    }

    // Update email1
    const updatedUser = await User.findOneAndUpdate(
      { email },               // find by main email
      { email1 },              // set new secondary email
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "email1 added successfully",
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          email1: updatedUser.email1,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Error adding email1", error: err.message },
      { status: 500 }
    );
  }
}
