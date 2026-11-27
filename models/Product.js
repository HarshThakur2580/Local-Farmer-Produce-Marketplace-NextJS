import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', default: null, index: true },
    farmerName: { type: String, required: true, trim: true, maxlength: 120 },
    location: { type: String, trim: true, maxlength: 160, default: '' },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    description: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
    price: { type: Number, required: true, min: 0.01, max: 1_000_000 },
    unit: { type: String, required: true, trim: true, maxlength: 40 },
    category: { type: String, required: true, trim: true, maxlength: 80, index: true },
    stock: { type: Number, required: true, min: 0, max: 1_000_000, default: 0 },
    isOrganic: { type: Boolean, default: false },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: { type: Number, min: 0, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
  },
  { timestamps: true }
);

ProductSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id.toString();
    if (returnedObject.farmerId) returnedObject.farmerId = returnedObject.farmerId.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.createdBy;
    return returnedObject;
  },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
