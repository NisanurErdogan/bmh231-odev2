const http = require('http');

const PORT = 3000;

const sunucu = http.createServer((istek, yanit) => {
  console.log(istek.method + ' ' + istek.url);

  if (istek.method !== 'GET') {
    yanit.writeHead(405, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Allow': 'GET'
    });
    yanit.end('Yönteme izin verilmiyor');
    return;
  }

  yanit.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  yanit.end('Sunucu çalışıyor');
});

sunucu.listen(PORT, () => {
  console.log('Sunucu çalışıyor: http://localhost:' + PORT);
});