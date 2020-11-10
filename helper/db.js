const mongoose = require('mongoose'); // mongoose'yi çağırıyorum

module.exports = () => { // modüle exports ile modülü dışarı veriyorum
  mongoose.connect('mongodb+srv://zest-illest:jalekar5534@mongodb-egitim.enxna.mongodb.net/mongodb-egitim?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true});

  mongoose.connection.on('open', () => { // bağlantı düzgün olursa callback fonksiyon sayesinde konsola o yazıyıyı yazdıracak fonksiyon bu köprüyü sağlıyor
   //   console.log('MongoDB: Connected') // open kısmı başarılı olduğu zamanı temsil ediyor
    });

  mongoose.connection.on('error', (err) => { // yukarıdakinin aynısı ama bu sefer open yerine error var hata alındığı zaman için
      console.log('MongoDB: Error', err) // burası da hata alınca verilecek mesaj
    }) // err parametresini de hatayı yollaması için kullanıyoruz
}; // yukarıda mongoose'nin bağlanacağı db'yi ayarladık ilk parametredeki link gibi olan şeyi mlabda oluşturduğum databaseden verdiler

// Promise
mongoose.Promise = global.Promise; // bu şekilde promiseyi tanımlıyoruz