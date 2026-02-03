import { diskStorage } from 'multer';
import path, { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export const allowedMimeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export const fileFilter = (req: any, file: Express.Multer.File, cb: Function) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Only PDF, Word, and Excel files are allowed'), false);
  }
};

export const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');

export const storage = diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    const randomSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    cb(null, `${file.fieldname}-${randomSuffix}${ext}`);
  },
});