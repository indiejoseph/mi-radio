const dns = require('native-dns');

const authority = { address: '8.8.8.8', port: 53, type: 'udp' };
const entries = [
  {
    domain: "ximalaya.com",
    records: [
      { type: "A", address: "192.168.1.29", ttl: 1800 }
    ]
  },
  {
    domain: "xmcdn.com",
    records: [
      { type: "A", address: "192.168.1.29", ttl: 1800 }
    ]
  }
];

// DNS Proxy
function dnsProxy (question, response, cb) {
  console.log('dns proxying:', question.name);

  var request = dns.Request({ // eslint-disable-line
    question: question, // forwarding the question
    server: authority,  // this is the DNS server we are asking
    timeout: 1000
  });

  // when we get answers, append them to the response
  request.on('message', (err, msg) => {
    msg.answer.forEach(a => {
      let entry = entries.filter(r => new RegExp(r.domain, 'i').exec(question.name));
      if (entry.length) {
        entry[0].records.forEach(record => {
          console.log('rewrite', question.name, record.address);
          record.name = question.name;
          record.ttl = record.ttl || 1800;
          response.answer.push(dns[record.type](record));
        });
      } else {
        response.answer.push(a);
      }
    });
  });

  request.on('end', cb);
  request.send();
}

module.exports = function () {
  const dnsServer = dns.createServer();

  dnsServer.on('request', function handleRequest (request, response) {
    console.log('request from', request.address.address, 'for', request.question[0].name);

    const f = request.question.map(question =>
      new Promise((resolve, reject) =>
        dnsProxy(question, response, (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        })
      )
    );

    Promise.all(f).then(() => response.send());
  });

  dnsServer.on('close', () =>
    console.log('server closed', dnsServer.address())
  );

  dnsServer.on('error', (err, buff, req, res) =>
    console.error(err.stack)
  );

  dnsServer.on('socketError', (err, socket) =>
    console.error(err)
  );

  return dnsServer;
};
