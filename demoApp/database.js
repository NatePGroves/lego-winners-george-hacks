const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  allergies: [String],
  createdAt: { type: Date, default: Date.now },
});

// Store Schema
const storeSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  zipcode: String,
  ward: String,
  anc: String,
  snapMatch: { type: Boolean, default: false },
  wicVendor: { type: Boolean, default: false },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  userAdded: { type: Boolean, default: false },
  claimed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Product Schema
const productSchema = new Schema({
  name: { type: String, required: true },
  storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
  allergens: [String],
  price: Number,
  createdAt: { type: Date, default: Date.now },
});

// StoreOwner Schema
const storeOwnerSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  storeName: { type: String, required: true },
  storeId: { type: Schema.Types.ObjectId, ref: "Store" },
  phone: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Store = mongoose.model("Store", storeSchema);
const Product = mongoose.model("Product", productSchema);
const StoreOwner = mongoose.model("StoreOwner", storeOwnerSchema);

const connectDB = async () => {
  try {
    const connectionString = process.env.MONGO_URI;

    if (!connectionString) {
      throw new Error("MONGO_URI is not defined in the environment variables.");
    }

    await mongoose.connect(connectionString);
    console.log("MongoDB cluster connected successfully");
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }
};

module.exports = { connectDB, User, Store, Product, StoreOwner };
