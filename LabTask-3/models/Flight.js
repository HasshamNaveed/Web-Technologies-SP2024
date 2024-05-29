const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const flightSchema = new mongoose.Schema({
  f_id: {type:Number , unique:true},
  f_name: { type: String, required: true },
  date: {
    type: Date,
    required: true,
    get: function(date) {
      // Strip out the time part when retrieving
      return date.toISOString().split('T')[0];
    },
    set: function(date) {
      // Ensure only date part is saved
      return new Date(date);
    }
  },
  at: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Regular expression to validate time in HH:MM format
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} is not a valid time format!`
    }
  },
  duration: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Regular expression to validate time in HH:MM format
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} is not a valid time format!`
    }
  },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  total_seats: { type: Number, required: true },
  businessFare: Number,
  economyFare: Number
});

flightSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Flight', flightSchema);
