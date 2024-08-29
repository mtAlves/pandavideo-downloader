import fs from 'fs';

export const extractVideoPathsFromPlaylist = (data: string): string[] => {
  const regex = /\d+x\d+\/video\.m3u8/gi;
  const matches = data.match(regex);
  return matches || [];
};

export const extractVideoLinks = (data: string): string[] => {
  const regex = /https?:\/\/[^\s]+\.ts/gi;
  const matches = data.match(regex);
  return matches || [];
};

export const createFolder = (dir: string) => {
  if (!fs.existsSync(dir)) {
    console.log('created folder:', dir)
    fs.mkdirSync(dir);
  }
}