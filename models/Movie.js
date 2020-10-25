const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema ({
   director_id: Schema.Types.ObjectId,
   title: {
       type: String,
       required: true
   },
   category: String,
   country: String,
   year: Number,
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