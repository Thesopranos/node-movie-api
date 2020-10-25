const express = require('express');
const router = express.Router();

// Models
const Movie = require('../models/Movie.js');

// list all movies
router.get('/', (req, res) => {
// öğrendiğimiz gibi uyguladık
  const promise = Movie.aggregate([  // şimdi directorleri ekledim sonrasında filmleri listelerken yönetmenler de listelensin istiyorum
    {
      $lookup: { // aynı işlemi yapıyoruz directore movies çekerkenki join gibi
        from: 'directors',
        localField: 'director_id',
        foreignField: '_id',
        as: 'director'
      }
    },
    {
      $unwind: '$director'
    }
  ]);  promise.then((data) => { // bu yüzden normalde find vardı onu aggregate yaptım
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

// list top10
router.get('/top10', (req, res) => {
// list all movies route'ini alıp burada değiştireceğiz
  const promise = Movie.find({ }).limit(10).sort({imdb_score: -1}); // yapmamız gereken iki şey var birincisi imdb scoruna göre sıralamak ikincisi ilk 10 tanesini almak
  promise.then((data) => { // yukarıda limit(10) ile 10 tanesini almış olduk sort ile de imdb skoruna göre sıraladık -1 yapınca büyükten küçüğe oldu
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

// alttaki ile üstekinin çakışma durumu var çünkü ikiside get isteği eğer Id bazlı aramayı listelemenin altına koyarsak sıkıntı olmaz çözümü bu

// search with Id
router.get('/:movie_id', (req, res,next) => {
 // res.send(req.params); // bir üstte :movie_id kısmına yazılan id'ye ne yazılır ise onun bilgilerini getirmesini sağlamış oluyoruz.
  const promise = Movie.findById(req.params.movie_id); // burada Id bazlı sorgu yaptık Id'yi de requestteki parametrelerden movie_id yani url kısmına girilen id'den aldık

  promise.then((movie) => { // burda hata yakalama işi yine aynı mantık fakat bu sefer özgün bir şey yapıcaz
    if (!movie) // eğer film yoksa
      next({message: 'The movie was not found.', code: 99}); // bu mesaj vericek // tabi yukarıda parametrelere next ekliyoruz

    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });

});

// add movie
router.post('/', (req, res, next) => {
  const { director_id, title, imdb_score, category, country, year} = req.body; // req nesnesinin altında body diye bir obje var
  // bu obje bizim göndermiş olduğumuz post body'sini burada barındırıyor
  // yukarıdaki yapı şu yazılan her bir değişkene karşılığında gelen şeyi atamış oluyor
  // yani post metod ya bu girilen veri bu yapı sayesinde ES6 sayesinde direkt atanmış oluyor

  // res.send(title); // yukarıda yaptıklarımızın sayesinde şu an postman'de test ederken key value olarak
  // bu send işleminde title direk düzgün bir şekilde title key'e karşı value olarak atandı.

  // Model işleme
  // bu model işleme olayında yukarıda yaptığımız atamanmış değişkenleri
  // burada veritabanındaki karşılıklarıyla eşleştiriyoruz.
  const movie = new Movie({
    director_id: director_id,
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
  res.json(data).catch((err) => { // burda hatayı yakalamasını sağladık var ise
    res.json(err); // burda da hatayı yazdırmasını sağladık
  });
  });
});

// update a movie
router.put('/:movie_id', (req, res,next) => {
// üstte search with Id'deki route'i elden geçirip update olayına dönüştürüyoruz
  const promise = Movie.findByIdAndUpdate(
      req.params.movie_id,  // ilk parametre olarak path'ten gelecek id yi almayı sağlıyoruz
      req.body, // bu 2. parametre olarak güncellenecek verinin güncel halini alıyoruz.
  // şimdi biz güncelleme yapınca bize postman'de eski datayı dönüyor biz yenisini dönmesi için alttakini yapıyoruz
  { // bu optionu true yaparak yeni datayı dönmesini sağlayabiliyoruz
  new: true
  }
  );

  promise.then((movie) => {
    if (!movie)
      next({message: 'The movie was not found.', code: 99});

    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });

});

// delete a movie
router.delete('/:movie_id', (req, res,next) => {
// üstte search with Id'deki route'i elden geçirip delete olayına dönüştürüyoruz
  const promise = Movie.findByIdAndDelete(
      req.params.movie_id
  );

  promise.then((movie) => {
    if (!movie)
      next({message: 'The movie was not found.', code: 99});

    res.json({movie: 'Movie is deleted.'});
  }).catch((err) => {
    res.json(err);
  });

});

// list with between
// list top10
router.get('/between/:start_year/:end_year', (req, res) => {
// list all movies route'ini alıp burada değiştireceğiz
  // altta başlangıç ve bitiş yıllarını string olarak aldık
  // bunları int'e dönüştürmemiz lazım
  // bu duruma integer'e pars etmek deniyor
  const {start_year, end_year} = req.params;
  const promise = Movie.find(
    { // yukarıda yaşadığımız string int olayını altta şöyle çözüyoruz
     year: {"$gte": parseInt(start_year), "$lte": parseInt(end_year) } // burada $gte operatörünü kullanacağız bu operatör büyük veya eşit anlamına geliyor
    }); // $lte operatörü ise küçük veya eşit anlamına geliyor // gte ve lte yerine gt ve lt dersek aynı tarihleri vermez eşitliği kabul etmez yani

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

module.exports = router;
