const http = require('http');
const fs = require('fs');
const path = require('path');

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

  const dosyaYolu = path.join(__dirname, 'public', 'index.html');

  fs.readFile(dosyaYolu, (hata, icerik) => {
    if (hata) {
      yanit.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      yanit.end('Sayfa bulunamadı');
      return;
    }
    yanit.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    yanit.end(icerik);
  });
});

sunucu.listen(PORT, () => {
  console.log('Sunucu çalışıyor: http://localhost:' + PORT);
});