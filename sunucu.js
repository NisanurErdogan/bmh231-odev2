const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const ICERIK_TURLERI = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8'
};

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

  const adres = new URL(istek.url, 'http://localhost');
  let adresYolu = adres.pathname;
  if (adresYolu === '/') {
    adresYolu = '/index.html';
  }

  const dosyaYolu = path.join(__dirname, 'public', adresYolu);
  const publicKlasoru = path.join(__dirname, 'public');

  if (!dosyaYolu.startsWith(publicKlasoru + path.sep)) {
    yanit.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    yanit.end('Sayfa bulunamadı');
    return;
  }

  fs.readFile(dosyaYolu, (hata, icerik) => {
    if (hata) {
      yanit.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      yanit.end('Sayfa bulunamadı');
      return;
    }
    const uzanti = path.extname(dosyaYolu);
    const tur = ICERIK_TURLERI[uzanti] || 'application/octet-stream';
    yanit.writeHead(200, { 'Content-Type': tur });
    yanit.end(icerik);
  });
});

sunucu.listen(PORT, () => {
  console.log('Sunucu çalışıyor: http://localhost:' + PORT);
});