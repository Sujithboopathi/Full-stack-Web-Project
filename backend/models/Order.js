const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{ menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }, quantity: Number }],
  total: Number,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);