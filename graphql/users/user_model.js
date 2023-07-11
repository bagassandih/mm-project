const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const users = new Schema(
  {
    first_name: {
      type: String,
      default: '',
    },
    last_name: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'deleted'],
      default: 'active',
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    email: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      default: '',
    },
    register_date: {
      date: {
        type: String,
        default: '',
      },
      time: {
        type: String,
        default: '',
      },
    },
    category_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'category',
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('user', users);
