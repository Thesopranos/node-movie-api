const jwt = require('jsonwebtoken'); // jwt'yi require ettik
// bu kısımın amacı bir ara katman oluşturup token'i kontrol edip
// ona göre route'lara erişim sağlamasını sağlamak.

module.exports = (req, res, next) => { // modülümüzü export kısmına yazıyoruz
    // token bize header olarak gelebilir
    // post body'sinde gelebilir
    // get query'sinde gelebilir
    // bu 3 ayrı durum için inceleyecez // test ettim localhost:3000/api/movies?token=asfasfasfasfasf bundaki tokeni kontrol etti mesela.
    const token = req.headers['x-access-token'] || req.body.token || req.query.token // query sorgu demek
    // yukarıda 3 durumu da yazdık headers kısmında x-access-token olarak yazdık
    // body kısmı için req.body.token şeklinde yazdık
    // body kısmında token diye bir key ve value olarak token'i sağlamazsak post edemiyoruz :)
    // header kısmında token verip body kısmında post işlemi yapabiliyoruz.
    // query kısmında ise req.query.token şeklinde yazdık
    // localhost:3000/api/movies?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1lcnRjYW5jYWtpciIsImlhdCI6MTYwNDc1NDQ2MywiZXhwIjoxNjA0NzU1MTgzfQ.YGkkwIMB4P8M1fIQj0prHrfGDq0Yzg66EoqjOUShNO8
    // yukarıdaki şekilde tokeni kullanıyoruz mesela
    // bunu da query yakalıyor
    // diyelim ki localhost:300/api/movies?token=asfasfsdfsdfsdf // böyle olursa burdaki token kısmını query ile yakalarız.
    if(token){ // token varsa
        // eğer token varsa bunu verify etmem lazım bunu için jwt'nin verify fonksiyonunu kullanıcaz
        jwt.verify(token, req.app.get('api_secret_key'), (err, decoded) => {
        // 1. parametre token
        // 2. parametre secret key'imiz
        // 3. parametre callback fonksiyonumuz
            if (err){
                res.json({
                    status: false,
                    message: 'Failed to authenticate token.' // token geçersiz ise bu json'u verecek
                })
            }else{ // her şey yolundaysa request'imize bu decode edilmiş şifreyi koymamız gerekiyor
                req.decode = decoded; // bizim o payload kısmını burada alıcaz işte
                console.log(decoded); // burda decode edilmiş veriyi bi görelim konsolda bakalım ne var
                // konsolda bize { username: 'mertcancakir', iat: 1604754463, exp: 1604755183 } böyle bir şey döndü
                // bizim payload'ımız ne ise onu bize verdi
                // bizim payload'ımızda username vardı iat token'in oluşturma tarihini belirtiyor
                // exp ise tokenin süresini belirtiyor
                next(); // next dememizin sebebi artık herhangi bir route ile eşleşebilirsin anlamına geliyor
            } // burdaki işlemimiz bu kadar şimdi app.js'e gidiyoruz.
        });
    }else{ // token yoksa
        res.json({
            status: false,
            message: 'No token provided.' // provided sağlanan demek sağlanan token yok demek tamamı
        })
    }
}