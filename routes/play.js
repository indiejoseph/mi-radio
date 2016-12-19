const path = require('path');
const cp = require('child_process');
const fs = require('fs');
const { spawn } = cp;
const mediaFile = path.join('/tmp', 'pl.m3u8');
const pidFile = path.join('/tmp', 'radio.pid');
const radioUrl = process.env.RADIO_URL;
let ffmpeg;

if (!radioUrl) {
  throw new Error('You must specify the radio url!');
}

const mediaStream = streamUrl => {
  // kill previous process
  if (!ffmpeg) {
    const args = [
      '-i', streamUrl,
      '-c:a', 'libfdk_aac',
      '-b:a', '64k',
      '-f', 'ssegment',
      '-hls_list_size', 3,
      '-segment_list', mediaFile,
      '-segment_time', 7,
      '-segment_list_size', 3,
      '-segment_wrap', 5,
      // '-segment_list_entry_prefix', 'http://localhost:8080/',
      '-segment_list_entry_prefix', 'http://api.ximalaya.com/uploads/playing/0/',
      path.join('/tmp', '64%03d.aac')];

    ffmpeg = spawn('ffmpeg', args);

    ffmpeg.stdout.on('exit', code => {
      ffmpeg.kill();
      ffmpeg = false;
    });

    fs.writeFileSync(pidFile, ffmpeg.pid, 'utf8');
  }
};

module.exports = function (router) {
  router
    .route(/.*\.m3u8$/)
    .get((req, res, next) => {
      console.log('playlist:', req.url);
      mediaStream(radioUrl);

      setTimeout(() => {
        res.header({ 'Content-Type': 'application/vnd.apple.mpegurl' });
        res.end(fs.readFileSync(mediaFile, 'utf8'));
      }, 1500);
    });

  router
    .route(/.*\.aac$/)
    .get((req, res, next) => {
      console.log('audio file:', req.url);
      const aacFile = path.join('/tmp', path.basename(req.url));
      const stat = fs.statSync(aacFile);
      const readStream = fs.createReadStream(aacFile);

      res.header({
        'Content-Type': 'audio/aac',
        'Content-Length': stat.size
      });

      readStream.pipe(res);
    });
};
