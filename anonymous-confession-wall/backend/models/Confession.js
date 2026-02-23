import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const confessionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Confession text is required'],
    maxlength: 500, // Bonus feature requirement
    trim: true,
  },
  secretCodeHash: {
    type: String,
    required: [true, 'Secret code is required'],
    minlength: [4, 'Minimum 4 characters required'], // 
  },
  reactions: { // [cite: 27]
    like: { type: Number, default: 0 },
    love: { type: Number, default: 0 },
    laugh: { type: Number, default: 0 },
  },
  commentCount: {
    type: Number,
    default: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

// Pre-save hook to hash the secret code
// Pre-save hook to hash the secret code
confessionSchema.pre('save', async function () {
  // If the code hasn't been modified, exit the hook
  if (!this.isModified('secretCodeHash')) return;
  
  // Mongoose automatically catches errors in async hooks, 
  // so we don't need a try/catch block or next() here!
  const salt = await bcrypt.genSalt(10);
  this.secretCodeHash = await bcrypt.hash(this.secretCodeHash, salt);
});

// Method to verify secret code for updates/deletes [cite: 32]
confessionSchema.methods.matchSecretCode = async function (enteredCode) {
  return await bcrypt.compare(enteredCode, this.secretCodeHash);
};

export default mongoose.model('Confession', confessionSchema);