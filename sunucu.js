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
     if (adres.pathname === '/api/etkinlikler') {
    const jsonYolu = path.join(__dirname, 'etkinlikler.json');
    fs.readFile(jsonYolu, 'utf8', (hata, veri) => {
      let etkinlikler;
      try {
        if (hata) throw hata;
        etkinlikler = JSON.parse(veri);
      } catch (e) {
        yanit.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        yanit.end(JSON.stringify({ hata: 'Veriler okunamadı' }));
        return;
      }

      const tur = adres.searchParams.get('tur');
      if (tur) {
        etkinlikler = etkinlikler.filter((e) => e.tur === tur);
      }

      yanit.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      yanit.end(JSON.stringify(etkinlikler));
    });
    return;
  }
    const idEsle = adres.pathname.match(/^\/api\/etkinlikler\/(\d+)$/);
  if (idEsle) {
    const id = Number(idEsle[1]);
    const jsonYolu = path.join(__dirname, 'etkinlikler.json');
    fs.readFile(jsonYolu, 'utf8', (hata, veri) => {
      let etkinlikler;
      try {
        if (hata) throw hata;
        etkinlikler = JSON.parse(veri);
      } catch (e) {
        yanit.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        yanit.end(JSON.stringify({ hata: 'Veriler okunamadı' }));
        return;
      }

      const etkinlik = etkinlikler.find((e) => e.id === id);
      if (!etkinlik) {
        yanit.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        yanit.end(JSON.stringify({ hata: 'Etkinlik bulunamadı' }));
        return;
      }

      yanit.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      yanit.end(JSON.stringify(etkinlik));
    });
    return;
  }
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