const kartlarKutusu = document.getElementById('kartlar');
const durumMetni = document.getElementById('durum');
const aramaKutusu = document.getElementById('arama');
const filtreDugmeleri = document.querySelectorAll('.filtre');

let tumEtkinlikler = [];
let seciliTur = 'tumu';

const TUR_ADLARI = {
  atolye: 'Atölye',
  soylesi: 'Söyleşi',
  topluluk: 'Topluluk'
};

function kartOlustur(etkinlik) {
  const kart = document.createElement('article');
  kart.className = 'kart';

  const etiket = document.createElement('span');
  etiket.className = 'etiket etiket-' + etkinlik.tur;
  etiket.textContent = TUR_ADLARI[etkinlik.tur] || etkinlik.tur;

  const baslik = document.createElement('h3');
  baslik.textContent = etkinlik.baslik;

  const tarih = document.createElement('p');
  const tarihNesnesi = new Date(etkinlik.tarih + 'T00:00:00');
  tarih.textContent = 'Tarih: ' + tarihNesnesi.toLocaleDateString('tr-TR');

  const yer = document.createElement('p');
  yer.textContent = 'Yer: ' + etkinlik.yer;

  const kontenjan = document.createElement('p');
  kontenjan.textContent = 'Kontenjan: ' + etkinlik.kontenjan;

  kart.append(etiket, baslik, tarih, yer, kontenjan);
  return kart;
}

function etkinlikleriCiz() {
  const aranan = aramaKutusu.value.trim().toLocaleLowerCase('tr-TR');

  const sonuc = tumEtkinlikler.filter((etkinlik) => {
    const turUygun = seciliTur === 'tumu' || etkinlik.tur === seciliTur;
    const aramaUygun = etkinlik.baslik.toLocaleLowerCase('tr-TR').includes(aranan);
    return turUygun && aramaUygun;
  });

  kartlarKutusu.textContent = '';

  if (sonuc.length === 0) {
    durumMetni.textContent = 'Aramanıza uygun etkinlik yok.';
    return;
  }

  durumMetni.textContent = '';
  sonuc.forEach((etkinlik) => {
    kartlarKutusu.append(kartOlustur(etkinlik));
  });
}

filtreDugmeleri.forEach((dugme) => {
  dugme.addEventListener('click', () => {
    filtreDugmeleri.forEach((d) => d.classList.remove('secili'));
    dugme.classList.add('secili');
    seciliTur = dugme.dataset.tur;
    etkinlikleriCiz();
  });
});

aramaKutusu.addEventListener('input', etkinlikleriCiz);

async function etkinlikleriYukle() {
  durumMetni.textContent = 'Yükleniyor...';
  try {
    const yanit = await fetch('/api/etkinlikler');
    if (!yanit.ok) {
      throw new Error('Sunucu hatası: ' + yanit.status);
    }
    tumEtkinlikler = await yanit.json();
    etkinlikleriCiz();
  } catch (hata) {
    kartlarKutusu.textContent = '';
    durumMetni.textContent = 'Etkinlikler yüklenemedi. Sunucunun çalıştığından emin olup sayfayı yenileyin.';
    console.error(hata);
  }
}

etkinlikleriYukle();

const form = document.getElementById('oneri-formu');
const formMesaj = document.getElementById('form-mesaj');

form.addEventListener('submit', (olay) => {
  olay.preventDefault();

  const ad = document.getElementById('ad').value.trim();
  const tarih = document.getElementById('tarih').value;
  const eposta = document.getElementById('eposta').value.trim();
  const hatalar = [];

  if (ad.length < 5) {
    hatalar.push('Etkinlik adı en az 5 karakter olmalıdır.');
  }

  if (!tarih) {
    hatalar.push('Tarih boş olamaz.');
  } else {
    const bugun = new Date();
    bugun.setHours(0, 0, 0, 0);
    const secilen = new Date(tarih + 'T00:00:00');
    if (secilen < bugun) {
      hatalar.push('Tarih geçmiş bir gün olamaz.');
    }
  }

  const epostaKalibi = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!epostaKalibi.test(eposta)) {
    hatalar.push('Geçerli bir e-posta adresi girin.');
  }

  formMesaj.textContent = '';

  if (hatalar.length > 0) {
    hatalar.forEach((metin) => {
      const p = document.createElement('p');
      p.className = 'hata';
      p.textContent = metin;
      formMesaj.append(p);
    });
    return;
  }

  const p = document.createElement('p');
  p.className = 'basari';
  p.textContent = 'Teşekkürler! Etkinlik öneriniz alındı.';
  formMesaj.append(p);
  form.reset();
});