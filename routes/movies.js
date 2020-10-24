const express = require('express');
const router = express.Router();

// Models
const Movies = require('../models/Movie.js');
router.post('/', (req, res, next) => {
  const { title, imdb_score, category, country, year} = req.body; // req nesnesinin altında body diye bir obje var
  // bu obje bizim göndermiş olduğumuz post body'sini burada barındırıyor
  // yukarıdaki yapı şu yazılan her bir değişkene karşılığında gelen şeyi atamış oluyor
  // yani post metod ya bu girilen veri bu yapı sayesinde ES6 sayesinde direkt atanmış oluyor

  // res.send(title); // yukarıda yaptıklarımızın sayesinde şu an postman'de test ederken key value olarak
  // bu send işleminde title direk düzgün bir şekilde title key'e karşı value olarak atandı.

  // Model işleme
  // bu model işleme olayında yukarıda yaptığımız atamanmış değişkenleri
  // burada veritabanındaki karşılıklarıyla eşleştiriyoruz.
  const movie = new Movies({
    title: title,
    imdb_score: imdb_score,
    category: category,
    country: country,
    year: year
  });
  // üstteki gibi tek tek yazmak yerine alttaki gibi bir alternatif var çok fazla nesne olursa diye
  // const movie = new Movies(req.body); // bunu kullanırken post'un altındaki gibi const ile tanımalam yapmıyoruz
  /* movie.save((err, data) => {
    if (err)
      res.json(err);

    res.json(data); // bu data'da veritabanına kaydedildikten sonra veritabanından o ilgili kayıt ne ise direkt onu bize dönecek
  }); */ // yukarıda data yerine status: 1 yapabiliriz olduğunda datayı dönmek yerine başarıyla gerçekleşti gibi bir mesaj verir
         // yukarıda req.body.title dersek mesela sadece title alırız o şekilde düşün.

  // PROMİSE
  // yukarıda /* */ arasına aldığım save kısmının hata yakalama olayının cath ile sağlanmış hali aşağıdaki gibi
  const promise = movie.save(); // yeni bir değişken oluşturup movie.save olayını aynı şekilde yapıyoruz
  promise.then((data) => { // burada hata ile karşılaşılmazsa status: 1 yazmasını sağladık normalde datayı gösteriyorduk aynı mantık
  res.json({status: 1}).catch((err) => { // burda hatayı yakalamasını sağladık var ise
    res.json(err); // burda da hatayı yazdırmasını sağladık
  });
  });
});

module.exports = router;
