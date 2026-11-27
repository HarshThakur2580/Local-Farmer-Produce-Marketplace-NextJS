import mongoose from 'mongoose';

const AdminSessionSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, expires: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.AdminSession || mongoose.model('AdminSession', AdminSessionSchema);
