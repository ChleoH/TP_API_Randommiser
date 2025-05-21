import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  photos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }],
  created_at: { type: Date, default: Date.now }
});

export default albumSchema;
