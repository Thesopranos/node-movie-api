const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// VALİDASYON İŞLEMLERİ SONRADAN YAPILDI
const MovieSchema = new Schema ({
   director_id: Schema.Types.ObjectId,
   title: {
       type: String,
       required: [true, '`{PATH} alanı zorunludur.`'],
       maxlength: [15, '`{PATH}` alanı `{MAXLENGTH} karakterden fazla olamaz.`'],
       minlength: [1, '`{PATH}` alanı `{MAXLENGTH}` karakterden büyük olmalıdır. '],
   },
   category: {
       type: String,
       maxlength: 30,
       minlength: 4
   },
   country: {
       type: String,
       maxlength: 30,
       minlength: 2
   },
   year: {
       type: Number,
       max: 2040,
       min: 1900
   },
   imdb_score: {
       type: Number,
       max: 10,
       min: 0,
   },
   createdAt: {
       type: Date,
       default: Date.now
   }
});

module.exports = mongoose.model('movie',MovieSchema);