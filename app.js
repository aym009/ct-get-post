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
    //add Date.now() to avoid to have same file name
    cb(null, Date.now() +  file.originalname);
  }
});
const upload = multer({ storage: storage });

// const lineCount = (file, cb) => {
//   let i;
//   let count = 0;
//   fs.createReadStream(file)
//     .on('err', err => cb(err))
//     .on('data', chunk => {
//       for (i = 0; i < chunk.length; ++i) {
//         if (chunk[i] === 10) count++;
//       }
//     })
//     .on('end', () => cb(null, count));
// }

app.get('/', (req, res) => {
  UploadedFile.find((err, files) => {
    res.render('index', {files});
  })
});

app.post('/upload', upload.single('file'), (req, res) => {
  // check the file is text file or not
  // const arr = req.file.originalname.split('.');
  // const checkTextFile = arr.length < 2 ? false : arr[arr.length - 1].toLowerCase() === 'txt' ? true : false;

  const filePath = `/${req.file.filename}`;
  // lineCount(filePath);

  const uploadedfile = new UploadedFile({
    name: req.file.filename,
    path: filePath,
    isText: checkTextFile
  });
  uploadedfile.save((err) => {
    res.redirect('/');
  });
});

app.get('/count/:fileName', (req, res) => {
  const file = '/' + req.params.fileName;
  res.send(`<p>this file contains line(s).</p>`)
});

app.listen(3001, () => {
  console.log('listening port 3001');
});