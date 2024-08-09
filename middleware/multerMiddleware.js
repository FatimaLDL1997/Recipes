import multer from "multer";
//multer takes everything we have in formData and 
//transforms it into a req.body 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const filename = file.originalname;
    cb(null, filename);
  },
});

const upload = multer({storage})

export default upload;  
