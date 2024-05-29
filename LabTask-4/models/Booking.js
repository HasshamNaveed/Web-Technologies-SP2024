const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  b_id: Number,
  user_id: {type:mongoose.Schema.Types.ObjectId, ref: 'User'},
  f_name: String,
  f_id: Number,
  name: {type:String,required:true},
  age: {type:Number,required:true},
  bookingClass: {type:String, enum:["BUSINESS","ECONOMY"], required:true},
  phone: {type:String, required:true},
  gender: { type: String, enum: ["M","F","O"], required:true},
  seat_no: Number,
  fare: Number,
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
});

module.exports = mongoose.model('Booking',bookingSchema);