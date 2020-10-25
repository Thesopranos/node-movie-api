const mongoose = require('mongoose'); // mongoose'yi onun için require ettik object id olarak göstermek için
const express = require('express');
const router = express.Router();

// Models
const Director = require('../models/Director');

// add a director
router.post('/', (req, res, next) => {
    const director = new Director(req.body);
    const promise = director.save();

    promise.then((director) => {
        res.json(director);
    }).catch((err) => {
        res.json(err);
    });
});

// list directors' with movies
router.get('/', (req, res) => {
    const promise = Director.aggregate([
        {
            $lookup: {
                from: 'movies',
                localField: '_id',
                foreignField: 'director_id',
                as: 'movies'
            }
        },
        {
            $unwind: {
                path: '$movies',
                preserveNullAndEmptyArrays: true // bu satır sayesinde herhangi bir filmi olmayan yönetmenlerde listede gösterilecek
            }
        },
        {
            $group: { // şimdi bu operatörü kullanmadan önce biz bu isteği çalıştırınca 1 yönetmenin iki filmi olduğu anlarda
                _id: { // bu filmler ayrı ayrı gözüküyor her birinde yine yönetmen bilgisi yazıyor biz 1 yönetmen gözüksün altında filmleri gözüksün diye
                    _id: '$_id',// $group operatörünü kullandık _id: adında bir tane filter verdik
                    name: '$name', // bu filterde _id'yi, name'i, surname'i, bio'yu alacağımızı söyledik.
                    surname: '$surname',
                    bio: '$bio'
                },
                movies: {
                    $push: '$movies' // burda da o filmlerin yönetmen altında tek çatıda olmasını sağladık
                } // yukarıda unwind ile değişken yaptığımız datayı buraya push ettik movies objesinin altına

            }
        },
        {
            $project: { // bize gösterirken yönetmeni direkt id olarak gösteriyor bunu değiştirmek için bunu yapıyoruz
                _id: '$_id._id', // burada  yukarıda group içindeki _id ve onun içindeki _id yi alıyoruz demek.
                name: '$_id.name', // tek tek çektik buraya hepsini
                surname: '$_id.surname',
                bio: '$_id.bio',
                movies: '$movies' // movies _id altında olmadığı için onu direkt aldık
            }
        }
    ]);
    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
})

// find with Id for directors
router.get('/:director_id', (req, res) => {
    const promise = Director.aggregate([
        {
            $match: {
                '_id': mongoose.Types.ObjectId(req.params.director_id) // bunu böyle yazarsak olmaz çünkü '_id' object id tipinde tutuluyor
            } // req.params.director_id'nin de object id tipinde olması lazım bunun için en üste çık çözümü yazıyorum
        }, // yukarıda mongoose'de Types altında ObjectId fonksiyonunu kullandık parametre olarakta _id verdik onu Object Id haline dönüştürdü
        {
            $lookup: {
                from: 'movies',
                localField: '_id',
                foreignField: 'director_id',
                as: 'movies'
            }
        },
        {
            $unwind: {
                path: '$movies',
                preserveNullAndEmptyArrays: true // bu satır sayesinde herhangi bir filmi olmayan yönetmenlerde listede gösterilecek
            }
        },
        {
            $group: { // şimdi bu operatörü kullanmadan önce biz bu isteği çalıştırınca 1 yönetmenin iki filmi olduğu anlarda
                _id: { // bu filmler ayrı ayrı gözüküyor her birinde yine yönetmen bilgisi yazıyor biz 1 yönetmen gözüksün altında filmleri gözüksün diye
                    _id: '$_id',// $group operatörünü kullandık _id: adında bir tane filter verdik
                    name: '$name', // bu filterde _id'yi, name'i, surname'i, bio'yu alacağımızı söyledik.
                    surname: '$surname',
                    bio: '$bio'
                },
                movies: {
                    $push: '$movies' // burda da o filmlerin yönetmen altında tek çatıda olmasını sağladık
                } // yukarıda unwind ile değişken yaptığımız datayı buraya push ettik movies objesinin altına

            }
        },
        {
            $project: { // bize gösterirken yönetmeni direkt id olarak gösteriyor bunu değiştirmek için bunu yapıyoruz
                _id: '$_id._id', // burada  yukarıda group içindeki _id ve onun içindeki _id yi alıyoruz demek.
                name: '$_id.name', // tek tek çektik buraya hepsini
                surname: '$_id.surname',
                bio: '$_id.bio',
                movies: '$movies' // movies _id altında olmadığı için onu direkt aldık
            }
        }
    ]);
    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
})

// update a director
router.put('/:director_id', (req, res,next) => {
    const promise = Director.findByIdAndUpdate(
        req.params.director_id,req.body,
        {
            new: true
        }
    );

    promise.then((director) => {
        if (!director)
            next({message: 'The director was not found.', code: 99});

        res.json(director);
    }).catch((err) => {
        res.json(err);
    });
});

// delete a director
router.delete('/:director_id', (req, res,next) => {
    const promise = Director.findByIdAndDelete(
        req.params.director_id
    );

    promise.then((director) => {
        if (!director)
            next({message: 'The director was not found.', code: 99});

        res.json({movie: 'Director is deleted.'});
    }).catch((err) => {
        res.json(err);
    });
});

module.exports = router;