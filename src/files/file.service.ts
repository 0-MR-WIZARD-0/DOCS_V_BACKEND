import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class FileService {
  async deleteFile(filePath: string) {
    if (!filePath) return;

    const absPath = path.join(process.cwd(), filePath);

    try {
      await fs.rm(absPath, { force: true });
    } catch (e) {
      console.error('Failed to delete file:', e);
    }
  }
}