import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  // NEW: The user's chosen Reddit-style handle
  secretIdentity: {
    type: String,
    unique: true,
    sparse: true, // Crucial: Allows existing users to have a 'null' identity without triggering duplicate key errors
    trim: true,
    minlength: [3, 'Identity must be at least 3 characters'],
    maxlength: [20, 'Identity cannot exceed 20 characters']
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);