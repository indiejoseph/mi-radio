const path = require('path');
const fs = require('fs');
const dns = require('./dns');
const http = require('./http');

const pidFile = path.join('/tmp', 'radio.pid');
const PORT = process.env.PORT || 80;
const DNS_PORT = process.env.DNS_PORT || 53;

const nameserver = dns();
nameserver.serve(DNS_PORT);
nameserver.on('listening', () => {
  console.log('dns server listening on', DNS_PORT);
});

const app = http().listen(PORT, () => {
  console.log('http server listening on', PORT);
});

process.on('SIGINT', () => {
  process.nextTick(() => {
    app.close();
  });

  // kill ffmpeg process
  if (fs.existsSync(pidFile)) {
    const pid = fs.readFileSync(pidFile, 'utf8');
    fs.unlinkSync(pidFile); // remove pid file

    process.nextTick(() => {
      process.kill(parseInt(pid, 10), 'SIGHUP'); // kill it
    });
  }

  process.exit(0);
});
