const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// VALİDASYON İŞLEMLERİ SONRADAN YAPILDI
const DirectorSchema = new Schema ({
   name: {
       type: String,
       maxlength: 30,
       minlength: 2,
       required: true,
   },
   surname: {
       type: String,
       maxlength: 30,
       minlength: 2,
       required: true
   },
   bio: {
       type: String,
       maxlength: 1000,
       minlength: 60
   },
   createdAt: {
       type: Date,
       default: Date.now
   }
});

module.exports = mongoose.model('director',DirectorSchema);