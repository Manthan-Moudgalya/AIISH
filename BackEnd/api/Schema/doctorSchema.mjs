import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const appointmentSchema = new mongoose.Schema({
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
    date: {
      type: String, 
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
    },
    disorderType: {
        type: String
    },
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'completed', 'cancelled'],
      default: 'scheduled',
    }
}, { _id: false });


const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  doctorType: {
    type: String,
    required: true,
  },
  appointments: {
    type: [appointmentSchema],
    default: [],
  },
  leaveDates: {
    type: [String], 
    default: [],
  },
  notifications: {
    type: [String], 
    default: [],
  }
});

doctorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare password
doctorSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

export default mongoose.model('Doctor', doctorSchema);
