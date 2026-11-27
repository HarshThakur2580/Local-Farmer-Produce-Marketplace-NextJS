import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    accountType: {
      type: String,
      enum: ['customer', 'farmer'],
      default: 'customer',
    },
    farmName: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.set('toJSON', {
  transform(_document, returnedObject) {
    delete returnedObject.password;
    return returnedObject;
  },
});

// Prevent re-compilation of model in development hot-reloading
export default mongoose.models.User || mongoose.model('User', UserSchema);
