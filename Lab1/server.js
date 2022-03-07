const net = require('net');
const fs = require('fs');
const Readable = require('stream').Readable;
const requestfn = require('request');
const { Worker } = require('worker_threads');

const stringifiedRequest = 'http://me.utm.md';
const hostName = 'me.utm.md';
const regex = /<img\s.*?src=(?:'|")([^'">]+)(?:png|jpg|gif'|")/g;

let urls = [];
let tempUrls = [];
let pattern;

const request =
  'GET ' +
  '/' +
  ' HTTP/1.1\r\n'
    .concat('Host: ' + hostName + '\r\n')
    .concat('Content-Type: text/html;charset=utf-8 \r\n')
    .concat('Accept-Language: ro \r\n')
    .concat('Content-Language: en, ase, ru \r\n')
    .concat(
      'User-Agent: Mozilla/5.0 (X11; Linux i686; rv:2.0.1) Gecko/20100101 Firefox/4.0.1 \r\n'
    )
    .concat('Vary: Accept-Encoding \r\n')
    .concat('\r\n');

const imageRequest =
  'GET ' +
  '/img/rom.png' +
  ' HTTP/1.1\r\n'
    .concat('Host: ' + hostName + ':80\r\n')
    .concat('Content-Type: text/html;charset=utf-8 \r\n')
    .concat('Accept-Language: ro \r\n')
    .concat('Content-Language: en, ase, ru \r\n')
    .concat(
      'User-Agent: Mozilla/5.0 (X11; Linux i686; rv:2.0.1) Gecko/20100101 Firefox/4.0.1 \r\n'
    )
    .concat('Vary: Accept-Encoding \r\n')
    .concat('\r\n');

const socket = new net.Socket();
socket.connect(80, hostName);

socket.on('connect', function () {
  console.log('Connection open with socket');
  socket.write(request);
});

socket.on('data', function (data) {
  while ((pattern = regex.exec(data))) {
    tempUrls.push(pattern[1]);
  }
  const filteredUrls = tempUrls.slice(0, tempUrls.length - 2);
  urls = [...filteredUrls];

  console.log(urls.length);
});

socket.on('close', function () {
  console.log('Connection closed');
});

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

const imgSocket = new net.Socket();

imgSocket.on('connect', function () {
  console.log('Connected to imgSocket');
  imgSocket.write(imageRequest);
});

imgSocket.on('data', function (data) {
  console.log('------');
  console.log(data);

  const encodedImg = Buffer.from(data).toString('base64');
  fs.writeFileSync('rom.png', encodedImg, { encoding: 'base64' }, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
});

imgSocket.on('close', function () {
  console.log('Connection closed for imgSocket');
});

setTimeout(() => {
  const halfLength = Math.ceil(urls.length / 2);
  let arrayFirstHalf = urls.slice(0, halfLength);
  let arraySecondHalf = urls.slice(halfLength, urls.length);

  arrayFirstHalf.forEach((url) => {
    const id = Math.floor(Math.random() * 100);
    requestfn(`http://${hostName}/${url}`).pipe(
      fs.createWriteStream(`images/${id}.png`)
    );
  });

  const worker = new Worker('./firstWorker.js', {
    workerData: { host: stringifiedRequest, urls: arraySecondHalf },
  });

  worker.once('message', (message) => {
    console.log('Worker from other thread done!');
  });
}, 4000);
