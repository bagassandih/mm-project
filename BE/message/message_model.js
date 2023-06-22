const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const message = new Schema(
  {
    from: {
      type: String,
      default: 'anonymous', 
    },
    to: {
      type: String,
      default: 'anonymous',
    },
    message: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      default: '',
    },
    time: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('message', message);
