# PANDAVIDEO DOWNLOADER

Downloads video segments in `.ts` format, concatenates these segments into a single `.mp4` video file using `FFmpeg`

## Requirements

- [Node.js](https://nodejs.org/)
- [FFmpeg](https://ffmpeg.org/download.html) (must be installed and accessible in terminal)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mtAlves/pandavideo-downloader.git
   cd pandavideo-downloader
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

## Usage

To run the script, use the following command:

  ```bash
  npm run start -- --playlist <link> --origin <origin> [options]
  ```

### Available Options
  * -p, --playlist: Link to the playlist (m3u8).
  * -r, --resolution: Video resolution. Default: 1920x1080.
  * -u, --user-agent: HTTP User-Agent request header.
  * -o, --origin: HTTP Origin request header.

### Example Usage
  ```bash
  npm run start -- --playlist https://example.com/playlist.m3u8 --origin https://example.com
  ```
