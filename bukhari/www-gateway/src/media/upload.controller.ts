import { Controller, Headers, Patch, Post, Query, Req } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Controller('media')
export class UploadController {
  private mediaPath: string = __dirname + '/../../public/media/';


  @Post('upload')
  async startUpload(@Req() req, @Headers() headers) {
    const galleryName = headers['gallery'];

    const filename: string = Date.now().toString();

    let dirPath = '';
    if (galleryName) dirPath = dirPath + `/${galleryName}/`;
    const fileId: string = path.join(dirPath, filename);

    fs.mkdirSync(path.join(this.mediaPath, dirPath), { recursive: true });
    return fileId;
  }

  @Patch('upload')
  async processUpload(@Req() req, @Headers() headers, @Query() query) {
    const totalSize = headers['upload-length'];
    const filename = headers['upload-name'];
    const offset = headers['upload-offset'];
    const fileId = query.patch;
    const ext = filename.split('.').pop();

    const chunk = [];

    return new Promise((res, rej) => {
      req.on('data', (part) => {
        chunk.push(part);
      }).on('end', () => {
        const filePath = this.mediaPath + fileId + '.' + ext;
        fs.appendFile(filePath, Buffer.concat(chunk), function(err) {
          if (err) throw err;
        });

        res({
          status: 200,
          offset,
          totalSize,
        });
      });
    });
  }
}