import multer from 'multer' ;


const fileFilter = (req, file, cb) => {
  if (
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/gif' ||
      file.mimetype == 'image/webp' ||
      file.mimetype == 'image/avif'
  ) {
    console.log("fileFilter");
    
      cb(null, true)
  }
  else {
      const err = new multer.MulterError();
      err.code = 'LIMIT_FILE_TYPE';
      err.message = 'Only jpeg,  jpg , png, avif and gif Image allow';
      return cb(err, false);
  }
};

//image upload
const uploadImage = (path) => {
    console.log("imageupload");
  const storage = multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, path);
      },
      filename: function (req, file, cb) {
          cb(null, Date.now() + '-' + file.originalname);
      }
  })
  return multer({ storage: storage, fileFilter }).fields([{ name: 'image', maxCount: 1 }]);
}

export default uploadImage