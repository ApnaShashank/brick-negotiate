import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google Auth users
  image: { type: String },
  bestPrice: { type: Number, default: 999999 },
  bestRounds: { type: Number, default: 0 },
  studs: { type: Number, default: 500 }, // Starting currency
  inventory: [{
    productId: String,
    purchasePrice: Number,
    acquiredAt: { type: Date, default: Date.now }
  }],
  achievements: [String],
  hasSeenGuide: { type: Boolean, default: false },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);

const NegotiationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  personality: { type: String, required: true },
  finalPrice: { type: Number, required: true },
  rounds: { type: Number, required: true },
  status: { type: String, enum: ['accepted', 'walked_away', 'failed'], required: true },
  history: [{
    round: Number,
    offer: Number,
    bid: Number,
    sentiment: String
  }]
}, { timestamps: true });

export const Negotiation = mongoose.models.Negotiation || mongoose.model('Negotiation', NegotiationSchema);

const FeedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, default: "Anonymous Player" },
  email: { type: String },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  type: { type: String, enum: ['bug', 'suggestion', 'praise', 'other'], default: 'other' }
}, { timestamps: true });

export const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
