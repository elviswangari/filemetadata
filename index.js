var express = require('express');
var cors = require('cors');
require('dotenv').config()

var app = express();

var multer = require('multer');
var upload = multer({ dest: 'uploads/' }); // Multer for handling file uploads
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Define schema for file information
const Schema = mongoose.Schema;
const fileSchema = new Schema({
  name: String,
  type: String,
  size: Number
});

// Create model based on schema
const File = mongoose.model('File', fileSchema);

// Route for file upload
app.post('/api/fileanalyse', upload.single('upfile'), function(req, res) {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  
  // Create a new file object
  const newFile = new File({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
  
  // Save file object to the database
  newFile.save()
    .then((file) => {
      // Respond with JSON containing file information
      res.json({
        name: file.name,
        type: file.type,
        size: file.size
      });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
