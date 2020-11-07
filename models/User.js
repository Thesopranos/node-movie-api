const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// VALİDASYON İŞLEMLERİ SONRADAN YAPILDI
const UserSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
});

module.exports = mongoose.model('user',UserSchema);