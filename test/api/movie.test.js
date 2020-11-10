const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

// Server
const server = require('../../app');
chai.use(chaiHttp);

// token almak için
let token; // değer vermiyoruz değerini describe içinde atayacağız

// şimdi tüm movieleri getiren api'nin testini yazıcaz
// bunun için token lazım bunu sağlamamız da gerekiyor.
describe('/api/movies tests', ( ) => {
    before((done) => { // before diye bir fonksiyon var bu testler başlamadan önce işlem yapmamızı sağlıyor bunu token almak için kullanıcaz
        chai.request(server) // bir istek yapıcaz
            .post('/authenticate') // isteği authenticate kısmına yapıcaz post isteği
            .send({ username: 'testuser', password: "testuserinpasswordu"}) // .send body kısmında yaptığımız işi yapıyor bir test user'i oluşturup onun authenticate bilgilerini giriyoruz.
            .end((err, res) => {
                token = res.body.token; // burda response ile body'den dönen token'i token'e eşitledik.
              //  console.log(token); // yaptığımız sistem çalışıyor mu diye bir kontrol ettik konsolda bastırıp
                done();
                 // done ile bitirdik.
            });

    });

    describe('/GET movies', () => {
       it('it should GET all the movies', (done) => {
           chai.request(server)
               .get('/api/movies')
               .set('x-access-token', token)
               .end((err, res) => {
                    res.should.have.status(200); // status 200 olmalı
                    res.body.should.be.a('array'); // ve body'den dönen verinin bir aray olması gerekiyor bu yüzden bu satırda gördüğümüz kodu kullanıyoruz
                    done();
           })
       });
    });

    describe('/POST movie', () => {
        it('it should POST a movie ', (done) => {
            const movie = { // burda bir örnek obje oluşturduk film post edebilmek için
                title: 'Udemy',
                director_id: '5f957d9300078c0e1c14f633',
                category: 'comedy',
                country: 'Turkey',
                year: 1950,
                imdb_score: 8
            }
            chai.request(server)
                .post('/api/movies')
                .send(movie)
                .set('x-access-token', token) // burda tokeni verdik
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object'); // burda obje olmasını kontrol ettik
                    res.body.should.have.property('title'); // burdan sonraki kısımda tek tek propertylerin varlığını kontrol ettik
                    res.body.should.have.property('director_id'); // eksik property olmaması için
                    res.body.should.have.property('category');
                    res.body.should.have.property('country');
                    res.body.should.have.property('year');
                    res.body.should.have.property('imdb_score');
                    done(); // asıl profesyonel olan test db'si oluşturup orada test etmek
                }) // bu şu an post ediyor direkt sürekli db'ye ekliyor ileride testten sonra silmesini de sağlayacağız
        })
    })
});