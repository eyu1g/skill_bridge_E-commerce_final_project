const mongoose = require('mongoose');

const OrderProductSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true }
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    description: { type: String, default: null },
    totalPrice: { type: Number, required: true },
    status: { type: String, required: true, default: 'pending' },
    products: { type: [OrderProductSchema], required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

OrderSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  }
});

OrderSchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  }
});

OrderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Order', OrderSchema);
