const multer = require('multer');
const path = require('path');
const fs = require('fs');

const possibleUploadDirs = [
  path.join(__dirname, '../../client/uploads'),
  path.join(__dirname, '../uploads'),
  path.join(__dirname, '../../public/uploads')
];
const uploadDir = possibleUploadDirs.find(d => fs.existsSync(d)) || path.join(__dirname, '../../client/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'item-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mime = file.mimetype.toLowerCase();

  if (allowed.test(ext) && (mime.includes('image') || allowed.test(mime))) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, WEBP, GIF) are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: fileFilter
});

module.exports = upload;
