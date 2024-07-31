const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, // reference to the associated book
  price: { type: Number },
  instock: { type: Number },
  image_url: { type: String },
});

itemSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/item/${this._id}`;
});

module.exports = mongoose.model('Item', itemSchema);
