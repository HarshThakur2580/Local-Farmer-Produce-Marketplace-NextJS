import mongoose from 'mongoose';

const FarmerSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    farmName: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    location: { type: String, required: true, trim: true, minlength: 2, maxlength: 160 },
    bio: { type: String, required: true, trim: true, minlength: 20, maxlength: 1500 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    specialties: [{ type: String, trim: true, maxlength: 80 }],
    yearsActive: { type: Number, min: 0, max: 100, default: 0 },
    isVerified: { type: Boolean, default: false },
    badge: { type: String, trim: true, maxlength: 80, default: 'Community Farmer' },
    rating: { type: Number, min: 0, max: 5, default: 0 },
  },
  { timestamps: true }
);

FarmerSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.owner;
    return returnedObject;
  },
});

export default mongoose.models.Farmer || mongoose.model('Farmer', FarmerSchema);
