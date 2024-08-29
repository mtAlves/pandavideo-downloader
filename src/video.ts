import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { AxiosInstance } from 'axios';

export const downloadVideo = async (
  httpClient: AxiosInstance,
  url: string,
  outputDir: string,
  fileName: string,
) => {
  const outputPath = path.resolve(outputDir, fileName);

  const writer = fs.createWriteStream(outputPath);

  const response = await httpClient.get(url, {
    responseType: 'stream',
  });

  console.log('Downloading: ', url);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

const removeTSFiles = (directory: string) => {
  try {
    const files = fs.readdirSync(directory);

    files.forEach(file => {
      if (file.endsWith('.ts')) {
        const filePath = path.resolve(directory, file);
        fs.unlinkSync(filePath);
      }
    });

    console.log('All .ts files removed successfully.');
  } catch (error) {
    console.error('Error while deleting .ts files:', error);
  }
};

const createFileList = (tsFiles: string[], listFilePath: string) => {
  const fileContent = tsFiles
    .map((file) => `file '${file}'`)
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+\.ts/g)?.pop() || '0', 10);
      const numB = parseInt(b.match(/\d+\.ts/g)?.pop() || '0', 10);
      return numA - numB;
    })
    .join('\n');

  fs.writeFileSync(listFilePath, fileContent);
};

const mergeTSFiles = (listFilePath: string, outputFilePath: string) => {
  return new Promise<void>((resolve, reject) => {
    const ffmpegCommand = `ffmpeg -f concat -safe 0 -i ${listFilePath} -c copy ${outputFilePath}`;

    exec(ffmpegCommand, (error, stdout, stderr) => {
      if (error) {
        reject(`Error merging files: ${error.message}`);
      } else {
        console.log(`FFmpeg output: ${stdout}`);
        console.log(`FFmpeg errors: ${stderr}`);
        resolve();
      }
    });
  });
};

export const combineTSFilesToMP4 = async (outputDir: string) => {
  const outputFilePath = path.resolve(outputDir, 'video.mp4');
  const listFilePath = path.resolve(outputDir, 'filelist.txt');

  const tsFiles = fs
    .readdirSync(outputDir)
    .filter((file) => file.endsWith('.ts'))
    .map((file) => path.resolve(outputDir, file));

  createFileList(tsFiles, listFilePath);

  try {
    await mergeTSFiles(listFilePath, outputFilePath);
    console.log(`Video successfully created: ${outputFilePath}`);
    removeTSFiles(outputDir)
    fs.unlinkSync(listFilePath);
  } catch (error) {
    console.error(error);
  }
};
