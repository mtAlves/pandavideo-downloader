import { Command } from 'commander';

import { createHttpClient } from './http-client';
import { createFolder, extractVideoLinks, extractVideoPathsFromPlaylist } from './utils';
import { combineTSFilesToMP4, downloadVideo } from './video';

const program = new Command();

program
  .option(
    '-p, --playlist <link>',
    'Playlist link. Ex.: https://b-vz-762f4612-e04.tv.pandavideo.com.br/c727b430-aaaa-1111-adf0-ed15e969bd4d/playlist.m3u8',
  )
  .option('-r, --resolution <resolution>', 'Default is 1920x1080. Ex.: 1280x720', '1920x1080')
  .option(
    '-u, --user-agent <agent>',
    'HTTP User-Agent request header',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  )
  .option('-o, --origin <origin>', 'The Origin request header. Ex.: https://www.google.com.br/')
  .option('-d, --output-dir <output-dir>', 'the output directory path', './output');

program.parse(process.argv);

const options = program.opts<{
  playlist?: string;
  resolution: string;
  userAgent: string;
  origin?: string;
  outputDir: string;
}>();

const { playlist, resolution, userAgent, origin, outputDir } = options;

if (!playlist) {
  console.error('Error: playlist(-p, --playlist <link>) argument is missing.');
  process.exit(1);
}

if (!origin) {
  console.error('Error: origin(-o, --origin <origin>) argument is missing.');
  process.exit(1);
}

const httpClient = createHttpClient({ origin, userAgent });
createFolder(outputDir)

const main = async () => {
  const { data: playlistResponse } = await httpClient.get(playlist);

  const videoPaths = extractVideoPathsFromPlaylist(playlistResponse);
  const possibleVideoResolutions = videoPaths.map(videoPath => videoPath.split('/')[0]);
  
  console.log('Possible video resolutions: ', possibleVideoResolutions.join(' '))

  const videoResolution = possibleVideoResolutions.includes(resolution) ? resolution : possibleVideoResolutions[possibleVideoResolutions.length - 1]
  const videoUrl = playlist.replace('playlist.m3u8', videoPaths.find(path => path.includes(videoResolution)))

  const { data: videoResponse } = await httpClient.get(videoUrl);
  
  const videoLinks = extractVideoLinks(videoResponse)
  await Promise.all(videoLinks.map((url, i) => downloadVideo(httpClient, url, outputDir, `${i}.ts`)))
  await combineTSFilesToMP4(outputDir)
};

main()