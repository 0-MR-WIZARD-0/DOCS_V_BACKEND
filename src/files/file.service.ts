import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class FileService {
  private readonly uploadsDir = path.resolve(process.cwd(), 'uploads');

  async deleteFile(filePath: string) {
    if (!filePath) return;

    const absPath = path.resolve(this.uploadsDir, path.normalize(filePath));

    if (!absPath.startsWith(this.uploadsDir)) {
      console.error('Path traversal attempt:', absPath);
      return;
    }

    await fs.rm(absPath, { force: true });
  }
}