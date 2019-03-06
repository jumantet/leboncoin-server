const cloudinary = require("cloudinary");

const uid2 = require("uid2");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadPictures = (req, res, next) => {
  const pictures = [];
  const files = req.body.files;
  let filesUploaded = 0;

  if (files && files.length) {
    files.forEach(file => {
      const name = uid2(16);
      cloudinary.v2.uploader.upload(
        file,
        {
          // J'assigne un dossier spécifique dans Cloudinary pour chaque utilisateur
          public_id: `leboncoin/${req.user._id}/${name}`
        },
        (error, result) => {
          console.log(error, result);
          // Si j'ai une erreur avec l'upload, je sors de ma route
          if (error) {
            return res.status(500).json({ error: error.message });
          }
          // Sinon, je push mon image dans le tableau
          pictures.push(result);
          // Et j'incrémente le nombre d'upload
          filesUploaded++;
          console.log("-------\n", result);
          // Si le nombre d'uploads est égal au nombre de fichiers envoyés...
          if (filesUploaded === files.length) {
            /* res
                            .status(200)
                            .json({message: `You've uploaded ${filesUploaded} files.`}); */
            // ... je stocke les images dans l'objet `req`...
            req.pictures = pictures;
            // ... et je poursuis ma route avec `next()`
            next();
          }
        }
      );
    });
  } else {
    next();
  }
};

module.exports = uploadPictures;
