const chai = require('chai'); // ilk modülleri require ettik
const chaiHttp = require('chai-http');
const should = chai.should(); // chainin bir fonksiyonu var should diye bu fonksiyonu
// biz olması gerekenleri yazarken kullanıcaz yani bu olmalı gibi durumlarda

// Server
const server = require('../../app'); // burda serveri dahil ettik app.js'i yani

chai.use(chaiHttp); // chai.use ile chaiHttp'yi kullanmasını sağladık

describe('Node Server', () => { // burda testlerimizin ne testeleri olacağını giriyoruz aslında bir açıklama
// sonra bir callback fonksiyon yazıyoruz.
// her describe içine istediğimiz kadar it() koyabiliriz bu it'ler içinde istediğimiz unit testi yapabiliyoruz
    // bu it 1. parametre olarak olacak işi yazdık açıklama gibisinden
    // 2. parametre olarak bir callback fonksiyon ondada parametre olarak done yazdık
    //
    it('(GET /) anasayfayı döndürür', (done) => {
        chai.request(server) // şimdi sorgu yapıcaz http call yapıcaz bunun için chai.request içine de nereye yapacaksak orayı yazıyoruz
                             //  biz servere yapacağımız için server yazdık yukarıda tanımlamıştık zaten
            .get('/') // get isteği yapacağımız için .get yazdık içine de nereye yapacaksak bu isteği onu yazıyoruz bu direkt kök dizin için oldu
            .end((err, res) => { // bu istek bittikten sonra .end diyoruz bunun err ve res parametreleri var.
                res.should.have.status(200); // burda şunu yaptık bu http durumu başarılı olmalı bunun status kodu 200 olduğu için içine 200 yazdık
                done(); // done(); // done test bitti her şey yolunda sıkıntı yok anlamında
            }) // res.should.have.status() bu http durumu sahip olmalı status(200) şeklinde okuyabiliriz.
    });

});