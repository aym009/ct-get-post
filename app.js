const express      = require('express');
const app          = express();
const bodyParser   = require('body-parser');
const multer       = require('multer');
const mongoose     = require('mongoose');
const hbs          = require('hbs');
const fs           = require('fs');

const UploadedFile = require('./models/uploadedFile');

mongoose.connect('mongodb://localhost/get-post');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public');
  },
  filename: (req, file, cb) => {
    //add Date.now() to give an unique file name
    cb(null, Date.now() +  file.originalname);
  }
});
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  UploadedFile.find((err, files) => {
    res.render('index', {files});
  })
});

app.post('/upload', upload.single('file'), (req, res) => {
  const uploadedfile = new UploadedFile({
    name: req.file.filename,
    path: `/${req.file.filename}`
  });
  uploadedfile.save((err) => {
    res.redirect('/');
  });
});

app.get('/count', (req, res) => {
  fs.readdir('./public', function(err, files) {
    let countArr = [];
    if(err) throw err;
    files.map(file => {
      let arr = file.split('.');
      if (arr.length > 1 && arr[arr.length - 1].toLowerCase() === 'txt') {
        const content = fs.readFileSync('./public/' + file);
        const lines = content.toString().split('\n').length - 1;
        countArr.push(lines);
      }
    })
    res.send(`<p>${countArr.length} .txt file(s) uploaded.<br>total ${countArr.reduce((a, b) => a + b)} line(s).</p>`)
  })
});

app.listen(3001, () => {
  console.log('listening port 3001');
});