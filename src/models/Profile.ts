import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  userId: String,
  name: String,
  location: String,
  age: {
    type: Number,
    required: false,
    default: null,
  },
  lastSeen: String,
  avatar: String,
  sumary: String,
  intro: String,
  lifeStory: String,
  freeTime: String,
  other: String,
  accomplishments: String,
  education: [String],
  employment: [String],
  startup: {
    name: String,
    description: String,
    progress: String,
    funding: String,
  },
  cofounderPreferences: {
    requirements: [String],
    idealPersonality: String,
    equity: String,
  },
  interests: {
    shared: [String],
    personal: [String],
  },
  linkedIn: String,

  // New fields for refresh tracking
  lastRefreshed: { type: Date, default: null },
  refreshStatus: {
    type: String,
    enum: ["pending", "success", "failed", null],
    default: null,
  },
  refreshError: { type: String, default: null },
  refreshAttempts: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["default", "active", "pending", "archived"],
    default: "default",
  },
});

ProfileSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const Profile =
  mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
