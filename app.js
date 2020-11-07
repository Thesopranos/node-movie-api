const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser =  require('body-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const movieRouter = require('./routes/movies');
const directorRouter = require('./routes/director');

const app = express();

// db connection
// const db = require('.helper/db.js'); // bunu böyle bırakırsak modülü sadece sayfaya dahil etmiş oluruz
// bu yüzden alttaki gibi yapıyoruz
const db = require('./helper/db.js')(); // böyle yapınca modül çalıştırılıyor

// Config
const config = require('./config');
app.set('api_secret_key', config.api_secret_key); // bu api_secret_key'i global olarak kullanabilmek için böyle bir atama yaptık
// data sonra bunu get ile kullanıcaz çünkü başka dosyalarda
// yukarıda yaptığımız işlem aynı altta yapılan gibi view engine jade gibi böyle düşünebiliriz.

// Token Middleware
const verifyToken = require('./middleware/verify-token'); // burda sayfaya dahil ettik middleware'i

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', verifyToken); // nerde kullanacaksak path kısmına onu yazıyoruz. Biz api altındaki her route için sağladık şu an
// yukarıdaki ile artık verifyToken'den geçmeyen herhangi bir route olmayacak.
app.use('/api/movies', movieRouter);
app.use('/api/directors',directorRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: { message: err.message, code: err.code } }); // burda express'in kendi hata yakalayıcısını burada kullanmak için
  // üstteki kısmı değiştirdik normalde res.render('error') gibi bir şey vardı biz json yaptık
});// bu üst kısımda hataların yapısını değiştirmiş olduk normalde mesaj gibiyken artık json gibi olmuş oldu

module.exports = app;
