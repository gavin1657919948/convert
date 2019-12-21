import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';

export class VideoUtil {
    static delDir(path) {
        let files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach((file, index) => {
                const curPath = path + '/' + file;
                if (fs.statSync(curPath).isDirectory()) {
                    this.delDir(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }

    static async merge(files: any[]) {

        return new Promise((resolve, reject) => {
            const tempdir = fs.mkdtempSync(__dirname + '/tmp');

            let command = ffmpeg();
            try {
                for (const file of files) {
                    const fileName = file.originalname;
                    fs.writeFileSync(tempdir + `/${fileName}`, file.buffer);
                    command = command.input(tempdir + `/${fileName}`);
                }
                command.on('end', () => {
                    const stream = fs.readFileSync(tempdir + `/out.webm`);
                    resolve(stream);
                    this.delDir(tempdir);
                }).mergeToFile(tempdir + `/out.webm`);
            } catch (error) {
                console.error('merge error:', error)
                reject(error);
            }
        })
    }
}