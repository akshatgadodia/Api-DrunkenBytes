const archiver = require('archiver');
const path = require('path');
const asyncHandler = require("../middlewares/asyncHandler");

const downloadImagesFolder = asyncHandler(async (req, res, next) => {
    const folderPath = path.join(__dirname, '..', 'public');
    const zipFilename = 'images.zip';
    const archive = archiver('zip', {
      zlib: { level: 9 } // compression level
    });
    archive.on('error', function (err) {
      console.error(err);
      res.status(500).send('Error creating archive');
    });
    res.attachment(zipFilename);
    archive.pipe(res);
    archive.directory(folderPath, false);
    archive.finalize();
});

const downloadLogFiles = asyncHandler(async (req, res, next) => {
  const folderPath = path.join(__dirname, '..', 'logs');
  const zipFilename = 'logs.zip';
  const archive = archiver('zip', {
    zlib: { level: 9 } // compression level
  });
  archive.on('error', function (err) {
    console.error(err);
    res.status(500).send('Error creating archive');
  });
  res.attachment(zipFilename);
  archive.pipe(res);
  archive.directory(folderPath, false);
  archive.finalize();
});

module.exports = { downloadImagesFolder, downloadLogFiles };