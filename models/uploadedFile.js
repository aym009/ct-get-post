const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uploadedFileSchema = new Schema({
  name: String,
  path: String
});

const UploadedFile = mongoose.model("UploadedFile", uploadedFileSchema);
module.exports = UploadedFile;