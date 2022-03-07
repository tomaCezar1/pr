const { parentPort, workerData } = require('worker_threads');
const requestfn = require('request');
const fs = require('fs');

const { host, urls } = workerData;

console.log('second thread data :', workerData);

urls.forEach((url) => {
  const id = Math.floor(Math.random() * 100);

  requestfn(`${host}/${url}`).pipe(fs.createWriteStream(`images/${id}.png`));
});

parentPort.postMessage('done');
