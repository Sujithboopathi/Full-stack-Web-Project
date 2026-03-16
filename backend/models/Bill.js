const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  customerName: String,
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bill', billSchema);