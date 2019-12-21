import { Controller, Get, Post, UseInterceptors, UploadedFile, Res, UploadedFiles } from '@nestjs/common';
import { ApiOperation, ApiConsumes, ApiImplicitFile } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import * as fs from 'fs';
import { join } from 'path';
import { VideoUtil } from './util/video.util';
const libConverter = require('./util/office.util');
const contentDisposition = require('content-disposition')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({ title: 'file convert' })
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'file', required: true })
  @Post('convert')
  @UseInterceptors(FileInterceptor('file'))
  async fileStream(@UploadedFile() file: any, @Res() res) {
    const fileName = `${Date.now()}-${file.originalname}`;
    const fileNewName = fileName.substring(fileName.lastIndexOf('.'), -1) + '.pdf';
    libConverter.convert(file.buffer, '.pdf', undefined, (err, done) => {
      if (err) {
        console.log("convert:err:", err);
        res.end('error')
      }
      res.set('Content-Disposition', contentDisposition(fileNewName));
      res.end(done);
    })

  }
  @ApiOperation({ title: 'videos merge 注意：提交时formData中的key名称须都为‘file’,respondType需设置为arraybuffer' })
  @Post('merge')
  @UseInterceptors(FilesInterceptor('file'))
  async fileMerge(@UploadedFiles() files: any, @Res() res) {
    console.log(files);
    const result = await VideoUtil.merge(files);
    console.log('result',result);
    res.set('Content-Disposition', contentDisposition('video.webm'));
    res.end(result);
  }
}

