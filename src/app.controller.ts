import { Controller, Get, Post, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { ApiOperation, ApiConsumes, ApiImplicitFile } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import * as fs from 'fs';
import { join } from 'path';
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
    const fileNewName = `${Date.now()}-${file.originalname}`;
    libConverter.convert(file.buffer, '.pdf', undefined, (err, done) => {
      if(err){
        console.log("convert:err:",err);
        res.end('error')
      }
      res.set('Content-Disposition', contentDisposition(fileNewName));
      res.end(done);
    })

  }
}
