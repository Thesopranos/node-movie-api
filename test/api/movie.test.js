const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

// Server
const server = require('../../app');
chai.use(chaiHttp);

// token almak için
let token, movieId; // değer vermiyoruz değerini describe içinde atayacağız
// movie id'yi Id bazlı arama yapabilmek için değişkenlere ekledik

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
            };

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
                    movieId = res.body._id; // burda movieId'yi test edebilmek için db'ye kaydederken movieId'ye de bunun Id'sini vermeyi sağladık.
                    done(); // asıl profesyonel olan test db'si oluşturup orada test etmek
                }) // bu şu an post ediyor direkt sürekli db'ye ekliyor ileride testten sonra silmesini de sağlayacağız
        })
    });

    describe('/GET/:director_id movie', () => {
        it('it should GET a movie by the given id', (done) => {
            chai.request(server)
                .get('/api/movies/'+ movieId)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title'); // yukarıdaki gibi aynı property'lere sahip olması gerekiyor
                    res.body.should.have.property('director_id');
                    res.body.should.have.property('category');
                    res.body.should.have.property('country');
                    res.body.should.have.property('year');
                    res.body.should.have.property('imdb_score');
                    res.body.should.have.property('_id').eql(movieId); // burda da .eql ile id property'si eşit olmalı yukarıda çektiğimiz movieId'ye
                    done();
                });
        });
    });

    describe('/PUT movie', () => {
        it('it should UPDATE a movie given by id', (done) => {
            const movie = { // burda bir örnek obje oluşturduk film post edebilmek için
                title: 'creative',
                director_id: '5f957dcd00078c0e1c14f634',
                category: 'Horror',
                country: 'France',
                year: 1970,
                imdb_score: 9
            };

            chai.request(server)
                .put('/api/movies/'+ movieId)
                .send(movie)
                .set('x-access-token', token) // burda tokeni verdik
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object'); // yukarıda yaptıklarımızın aynısını put için yaptık
                    res.body.should.have.property('title').eql(movie.title);  // ekstra olarak yukarıda oluşturulan filmi
                    res.body.should.have.property('director_id').eql(movie.director_id);  // burda id'si verilmiş film ile update etmek.
                    res.body.should.have.property('category').eql(movie.category); // eql ile hepsini kontrol ediyoruz
                    res.body.should.have.property('country').eql(movie.country);
                    res.body.should.have.property('year').eql(movie.year);
                    res.body.should.have.property('imdb_score').eql(movie.imdb_score);
                    done();
                });
        })
    });


});