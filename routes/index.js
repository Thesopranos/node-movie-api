const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Models
const User = require('../models/User')

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.post('/register', (req, res, next) => {
  // şimdi bize username ve password olarak 2 data gelecek bunu ayarlayacaz
  const { username, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => { // valla reyis kullanımını intten okudum ingilizce
    const user = new User({ // sen de oku yani npmjs.com'dan incele
      username, // kısaca şunu söyleyeyim doğru fonksiyonu bulup dışarıda yazdığın fonksiyonları
      password: hash // içine yazıcaksın const user = new User'i ve err catch olayını
    }); // password kısımnı da hash e eşitleyeceksin bu kadar olay
    // bunu username:username şeklinde kullanmak yerine böyle de kullanabiliriz
    const promise = user.save();
    promise.then((data) => {
      res.json(data)
    }).catch((err) => {
      res.json(err);
    })
  });
});

router.post('/authenticate', (req, res) => {
  const { username, password } = req.body; // burda body'den username ve password aldık

  User.findOne({ // burda kullanıcı bulmaya çalışıyoruz User modelini kullanıp
    username // burda aradığımız şeyi yazdık
  }, (err, user) => { // burda bir callback fonksiyon yazdık
    if (err) // hata dönerse burada kadar
      throw err; // hatayı yazdırmasını sağladık

    if(!user){ // kullanıcı yok ise
      res.json({ // burdaki objeyi json ile vericek
        status: false,
        message: 'Authentication failed, user not found.'
      });
    }else{ // user var ise bu kısıma geçiyor
      bcrypt.compare(password, user.password).then((result) => { // burdaki fonksiyon ile girilen şifreyle
        if (!result){ // db'de ki şifreyi kıyaslayıp true ya da false döndürüyor.
          res.json({
            status: false,
            message: 'Authentication failed, wrong password.'
          });
        }else{  // şimdi burada jwt kullanıcaz bunun için dosyama config.js diye bir şey ekledim
          // ilk olarak payload hazırlayacaz
          const payload = { // burda bir obje hazırlayacaz
            // payload'da ne taşımak istiyorsak yazıyoruz
            username // bunu direkt böyle bıraktım bu zaten username: username demek
          };
          // şimdi bunun peşinden token oluşturucaz bunun için jwt lazım bunu require ettim yukarıda
          const token = jwt.sign(payload, req.app.get('api_secret_key'), { // burda 1. parametre olarak yukarıda oluşturduğumuz payloadı verdik
            expiresIn: 720 // 2. parametre olarak app.set ile api_secret_key'i global olarak kullanıma açtık bunu da burda app.get ile kullanıyoruz
          }); // expiresIn ile bu token için süre verebiliyoruz bu dakika cinsinden şu an 12 saat yani, bu süre boyunca bu token geçerli olacak

          // daha sonra oluşturduğumuz bu token'i json tipinde dönücez
          res.json({
            status: true,
            token
          })
        }
      });
    }
  });

});



module.exports = router;
