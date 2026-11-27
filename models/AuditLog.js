import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema(
  {
    user: { type: String, required: true, index: true },
    userName: { type: String, required: true, trim: true },
    action: { type: String, required: true, trim: true, maxlength: 120 },
    target: { type: String, required: true, trim: true, maxlength: 200 },
    details: { type: String, trim: true, maxlength: 2000, default: '' },
    ipAddress: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

AuditLogSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id.toString();
    returnedObject.timestamp = returnedObject.createdAt;
    returnedObject.adminName = returnedObject.userName;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.user;
    return returnedObject;
  },
});

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
