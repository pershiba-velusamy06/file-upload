const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const titlesSchema = new Schema({
  value: {
    type: String,
    required: true
  },
  isValid: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('titlesList', titlesSchema,"titlesList");
