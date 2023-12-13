import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import bcrypt from "bcrypt";

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

export const hashData = async (data) => {
  return bcrypt.hash(data, 10);
};

export const compareData = async (data, hashData) => {
  return bcrypt.compare(data, hashData);
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(_dirname, "public", "images"));
  },
  filename: function (req, file, cb) {
    // extrae la extencion del archivo
    let ext = extname(file.originalname).toLocaleLowerCase();
    // le paso la extencion al uuid
    cb(null, uuidv4() + ext);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const ext = filetypes.test(extname(file.originalname));

    if (mimetype && ext) {
      return cb(null, true);
    }
    cb(new Error("Only jpeg, jpg, png, & gif file supported!"));
  },
});

export default _dirname;
