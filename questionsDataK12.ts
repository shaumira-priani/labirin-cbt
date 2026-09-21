import { Question } from '../types/exam';

export const K12_ROUTE_SEQUENCE: number[] = [
  3, 4, 7, 8, 9, 11, 12, 14, 15, 16, 17, 19, 21, 22, 28, 29, 32, 33, 37, 40
];

export const QUESTIONS_DATA_K12: Record<number, Question> = {
  1: {
    id: 1,
    level: 1,
    topic: 'Sifat & Karakteristik Enzim',
    question: 'Enzim merupakan biokatalisator dalam metabolisme tubuh. Pernyataan yang paling tepat mengenai cara kerja enzim adalah...',
    options: [
      { key: 'A', text: 'Menurunkan energi aktivasi tanpa ikut habis dalam reaksi' },
      { key: 'B', text: 'Menambah jumlah produk akhir yang dihasilkan dari bahan substrat' },
      { key: 'C', text: 'Mengubah struktur kimianya secara permanen setelah reaksi selesai' },
      { key: 'D', text: 'Menghentikan reaksi kimia yang tidak menguntungkan tubuh' },
      { key: 'E', text: 'Membutuhkan suhu yang sangat tinggi di atas 100°C agar dapat bereaksi' }
    ],
    correctAnswer: 'A',
    explanation: 'Enzim berfungsi sebagai biokatalisator yang mempercepat laju reaksi dengan cara menurunkan energi aktivasi tanpa mengubah kesetimbangan reaksi dan tidak ikut habis bereaksi.'
  },
  2: {
    id: 2,
    level: 1,
    topic: 'Model Kerja Enzim (Lock & Key)',
    question: 'Menurut teori kunci dan gembok (Lock and Key), enzim dan substrat dapat berikatan secara tepat karena...',
    options: [
      { key: 'A', text: 'Substrat melebur dan menyatu ke dalam struktur protein enzim' },
      { key: 'B', text: 'Sisi aktif enzim memiliki bentuk ruang yang spesifik dan kaku sesuai bentuk substrat' },
      { key: 'C', text: 'Sisi aktif enzim bersifat sangat fleksibel dan terus berubah bentuk' },
      { key: 'D', text: 'Enzim dapat mengikat berbagai macam jenis bentuk substrat sekaligus' },
      { key: 'E', text: 'Reaksi berlangsung tanpa memerlukan kontak langsung antara enzim dan substrat' }
    ],
    correctAnswer: 'B',
    explanation: 'Teori Lock and Key menyatakan bahwa sisi aktif enzim memiliki bentuk komplementer yang kaku (rigid), cocok tepat dengan satu substrat spesifik seperti anak kunci dengan lubang gemboknya.'
  },
  3: {
    id: 3,
    level: 1,
    topic: 'Model Kerja Enzim (Induced Fit)',
    question: 'Menurut teori ketepatan induksi (Induced Fit), peristiwa yang terjadi saat molekul substrat mendekati sisi aktif enzim adalah...',
    options: [
      { key: 'A', text: 'Substrat akan mengubah dirinya menjadi bentuk yang kaku' },
      { key: 'B', text: 'Sisi aktif enzim akan menyesuaikan bentuknya sehingga mencengkeram substrat dengan pas' },
      { key: 'C', text: 'Enzim akan hancur dan membentuk molekul enzim yang baru' },
      { key: 'D', text: 'Reaksi kimia terhenti sementara sampai suhu lingkungan naik' },
      { key: 'E', text: 'Substrat memecah dirinya sendiri sebelum menyentuh sisi aktif enzim' }
    ],
    correctAnswer: 'B',
    explanation: 'Teori Induced Fit (Koshland) menyatakan bahwa sisi aktif enzim bersifat fleksibel. Ketika substrat masuk, sisi aktif mengalami perubahan konformasi minor agar pas mengikat substrat.'
  },
  4: {
    id: 4,
    level: 1,
    topic: 'Inhibitor Kompetitif',
    question: 'Suatu zat kimia memiliki bentuk struktur ruang yang sangat mirip dengan substrat asli sehingga bersaing memperebutkan sisi aktif enzim. Zat penghambat ini dinamakan...',
    options: [
      { key: 'A', text: 'Inhibitor nonkompetitif' },
      { key: 'B', text: 'Koenzim pembantu' },
      { key: 'C', text: 'Inhibitor kompetitif' },
      { key: 'D', text: 'Aktivator enzim' },
      { key: 'E', text: 'Produk sampingan' }
    ],
    correctAnswer: 'C',
    explanation: 'Inhibitor kompetitif bersaing langsung dengan substrat untuk menempati sisi aktif enzim karena memiliki kemiripan struktur molekul.'
  },
  5: {
    id: 5,
    level: 1,
    topic: 'Inhibitor Non-Kompetitif',
    question: 'Inhibitor nonkompetitif dapat menghentikan laju reaksi enzim dengan cara...',
    options: [
      { key: 'A', text: 'Menempel pada bagian lain selain sisi aktif sehingga mengubah bentuk sisi aktif enzim' },
      { key: 'B', text: 'Menempel langsung pada sisi aktif sehingga substrat terhalang masuk' },
      { key: 'C', text: 'Membakar substrat sebelum terjadi kontak dengan enzim' },
      { key: 'D', text: 'Menurunkan konsentrasi air dan ion mineral di dalam sel' },
      { key: 'E', text: 'Meniru persis bentuk fisik molekul substrat' }
    ],
    correctAnswer: 'A',
    explanation: 'Inhibitor nonkompetitif terikat pada sisi selain sisi aktif (sisi alosterik), menyebabkan perubahan bentuk sisi aktif sehingga substrat tidak lagi dapat berikatan.'
  },
  6: {
    id: 6,
    level: 1,
    topic: 'Percobaan Enzim Katalase',
    question: 'Enzim katalase yang banyak terdapat pada organ hati berfungsi menguraikan zat racun sisa metabolisme. Reaksi penguraian yang benar adalah...',
    options: [
      { key: 'A', text: 'Menguraikan Asam Piruvat menjadi Asam Laktat dan energi' },
      { key: 'B', text: 'Menguraikan Hidrogen Peroksida (H2O2) menjadi Air (H2O) dan Gas Oksigen (O2)' },
      { key: 'C', text: 'Menguraikan Glukosa menjadi Gas Karbon Dioksida (CO2) dan Etanol' },
      { key: 'D', text: 'Menguraikan Lemak menjadi Asam Lemak dan Gliserol' },
      { key: 'E', text: 'Menguraikan Karbon Dioksida (CO2) menjadi Gas Oksigen (O2)' }
    ],
    correctAnswer: 'B',
    explanation: 'Katalase mempercepat penguraian hidrogen peroksida beracun menjadi senyawa tidak berbahaya: 2 H2O2 -> 2 H2O + O2.'
  },
  7: {
    id: 7,
    level: 1,
    topic: 'Percobaan Katalase (Pengaruh Suhu)',
    question: 'Pada uji praktikum enzim katalase, ekstrak hati segar yang ditetesi H2O2 menghasilkan banyak gelembung gas dan menyalakan bara api. Namun, saat ekstrak hati dipanaskan mendidih terlebih dahulu lalu ditetesi H2O2, tidak terbentuk gelembung dan bara api padam. Hal ini membuktikan bahwa...',
    options: [
      { key: 'A', text: 'Larutan H2O2 telah habis menguap akibat proses pemanasan' },
      { key: 'B', text: 'Enzim katalase mengalami denaturasi (kerusakan struktur protein) akibat suhu tinggi' },
      { key: 'C', text: 'Enzim katalase membeku permanen pada suhu mendidih' },
      { key: 'D', text: 'Gas oksigen yang dihasilkan terlalu pekat sehingga mematikan bara api' },
      { key: 'E', text: 'Enzim katalase hanya dapat bekerja aktif dalam suasana larutan basa' }
    ],
    correctAnswer: 'B',
    explanation: 'Enzim tersusun atas protein yang bersifat termolabil. Pemanasan suhu tinggi menyebabkan ikatan tersier protein rusak (denaturasi), sehingga sisi aktif kehilangan kemampuan katalisis.'
  },
  8: {
    id: 8,
    level: 1,
    topic: 'Percobaan Katalase (Pengaruh pH)',
    imageUrl: 'https://imgix2.ruangguru.com/assets/miscellaneous/png_qc350v_8062.PNG',
    imageCaption: 'Tabel data hasil percobaan enzim katalase pada berbagai kondisi pH dan perlakuan',
    question: 'Perhatikan tabel data hasil percobaan enzim katalase pada gambar di atas!\n\nKesimpulan yang tepat berdasarkan data di atas adalah...',
    options: [
      { key: 'A', text: 'Enzim katalase bekerja maksimal pada suasana netral' },
      { key: 'B', text: 'Enzim katalase bekerja paling optimal pada suasana asam' },
      { key: 'C', text: 'HCl dan NaOH berfungsi sebagai aktivator enzim katalase' },
      { key: 'D', text: 'Derajat keasaman (pH) tidak berpengaruh pada kerja enzim katalase' },
      { key: 'E', text: 'Ekstrak hati rusak jika berada di larutan netral' }
    ],
    correctAnswer: 'A',
    explanation: 'Berdasarkan data tabel percobaan, gelembung terbanyak (+++) dan nyala api membara terang hanya diperoleh pada suasana netral (pH 7). Hal ini membuktikan enzim katalase bekerja maksimal pada suasana netral.'
  },
  9: {
    id: 9,
    level: 1,
    topic: 'Percobaan Katalase (Uji Nyala Api)',
    question: 'Pada pengujian ekstrak hati dengan larutan H2O2, munculnya gelembung udara yang mampu menyalakan kembali bara api pada ujung lidi membuktikan bahwa gas yang dihasilkan adalah...',
    options: [
      { key: 'A', text: 'Gas Karbon Monoksida (CO)' },
      { key: 'B', text: 'Gas Karbon Dioksida (CO2)' },
      { key: 'C', text: 'Gas Hidrogen (H2)' },
      { key: 'D', text: 'Gas Oksigen (O2)' },
      { key: 'E', text: 'Gas Nitrogen (N2)' }
    ],
    correctAnswer: 'D',
    explanation: 'Gas oksigen (O2) bersifat mendukung proses pembakaran sehingga saat tabung reaksi didekati bara api lidi, bara api akan menyala kembali menjadi nyala api.'
  },
  10: {
    id: 10,
    level: 1,
    topic: 'Faktor Konsentrasi Substrat',
    question: 'Jika jumlah enzim dalam suatu tabung reaksi dijaga konstan, lalu konsentrasi substrat ditambah terus-menerus, maka kecepatan reaksi mula-mula naik lalu menjadi konstan (mendatar). Penyebab kecepatan reaksi menjadi konstan adalah...',
    options: [
      { key: 'A', text: 'Enzim telah mengalami kejenuhan karena seluruh sisi aktifnya telah terikat oleh substrat' },
      { key: 'B', text: 'Enzim mengalami kerusakan fisik akibat bertumpuknya molekul substrat' },
      { key: 'C', text: 'Terjadi penurunan suhu larutan reaksi secara spontan' },
      { key: 'D', text: 'Substrat berubah sifat menjadi zat inhibitor kompetitif' },
      { key: 'E', text: 'Reaksi berbalik arah memecah molekul enzim menjadi asam amino' }
    ],
    correctAnswer: 'A',
    explanation: 'Laju reaksi mencapai kecepatan maksimal (Vmax) ketika semua sisi aktif enzim telah jenuh terikat dengan substrat.'
  },
  11: {
    id: 11,
    level: 2,
    topic: 'Tahapan Respirasi Aerob',
    question: 'Urutan tahapan pembongkaran glukosa secara lengkap pada respirasi aerob seluler yang benar adalah...',
    options: [
      { key: 'A', text: 'Glikolisis -> Dekarboksilasi Oksidatif -> Siklus Krebs -> Rantai Transpor Elektron' },
      { key: 'B', text: 'Siklus Krebs -> Glikolisis -> Dekarboksilasi Oksidatif -> Rantai Transpor Elektron' },
      { key: 'C', text: 'Glikolisis -> Siklus Krebs -> Dekarboksilasi Oksidatif -> Transpor Elektron' },
      { key: 'D', text: 'Dekarboksilasi Oksidatif -> Glikolisis -> Siklus Krebs -> Transpor Elektron' },
      { key: 'E', text: 'Transpor Elektron -> Siklus Krebs -> Glikolisis -> Dekarboksilasi Oksidatif' }
    ],
    correctAnswer: 'A',
    explanation: 'Respirasi aerob seluler diawali dengan glikolisis (sitosol), dilanjutkan dekarboksilasi oksidatif (matriks mitokondria), siklus Krebs (matriks mitokondria), dan diakhiri rantai transpor elektron (krista mitokondria).'
  },
  12: {
    id: 12,
    level: 2,
    topic: 'Tahap Glikolisis',
    question: 'Glikolisis berlangsung di dalam sitoplasma (sitosol) sel. Proses yang terjadi pada tahapan glikolisis tersebut adalah pemecahan...',
    options: [
      { key: 'A', text: 'Asam Piruvat menjadi Gas Karbon Dioksida dan Etanol' },
      { key: 'B', text: '1 molekul Glukosa (6 atom C) menjadi 2 molekul Asam Piruvat (3 atom C)' },
      { key: 'C', text: '1 molekul Glukosa langsung menjadi 36 molekul ATP tanpa senyawa antara' },
      { key: 'D', text: 'Asetil Ko-A menjadi Asam Sitrat di dalam matriks mitokondria' },
      { key: 'E', text: 'Molekul Air menjadi Gas Oksigen dan ion Hidrogen' }
    ],
    correctAnswer: 'B',
    explanation: 'Glikolisis adalah proses pemecahan 1 molekul glukosa (6C) menjadi 2 molekul asam piruvat (3C) di dalam sitoplasma.'
  },
  13: {
    id: 13,
    level: 2,
    topic: 'Hasil Bersih Glikolisis',
    question: 'Dari pemecahan 1 molekul glukosa yang masuk ke tahap glikolisis, produk bersih yang dihasilkan adalah...',
    options: [
      { key: 'A', text: '2 Asetil Ko-A, 2 FADH2, dan 4 ATP' },
      { key: 'B', text: '2 Asam Laktat, 2 CO2, dan 2 ATP' },
      { key: 'C', text: '2 Asam Piruvat, 2 NADH, dan 2 ATP' },
      { key: 'D', text: '1 Asam Piruvat, 1 NADH, dan 36 ATP' },
      { key: 'E', text: '2 Asam Piruvat, 2 CO2, dan 2 FADH2' }
    ],
    correctAnswer: 'C',
    explanation: 'Glikolisis menghasilkan total 4 ATP tetapi memakai 2 ATP di awal, sehingga hasil bersihnya adalah 2 Asam Piruvat, 2 NADH, dan 2 ATP.'
  },
  14: {
    id: 14,
    level: 2,
    topic: 'Dekarboksilasi Oksidatif',
    question: 'Pada tahap Dekarboksilasi Oksidatif yang terjadi di matriks mitokondria, Asam Piruvat (3 atom C) diubah menjadi senyawa...',
    options: [
      { key: 'A', text: 'Asam Sitrat (6 atom C) dengan menyerap energi ATP' },
      { key: 'B', text: 'Asetil Ko-A (2 atom C) dengan melepaskan gas CO2 dan membentuk NADH' },
      { key: 'C', text: 'Asam Laktat tanpa menghasilkan gas Karbon Dioksida' },
      { key: 'D', text: 'Glukosa kembali untuk menghemat cadangan energi sel' },
      { key: 'E', text: 'Gas Oksigen dan molekul Air' }
    ],
    correctAnswer: 'B',
    explanation: 'Tiap 1 asam piruvat melepaskan CO2, membentuk NADH, dan berikatan dengan Koenzim A membentuk Asetil Ko-A (2C).'
  },
  15: {
    id: 15,
    level: 2,
    topic: 'Siklus Krebs & Pelepasan CO2',
    question: 'Tahap Siklus Krebs berlangsung di dalam matriks mitokondria. Gas sisa pernapasan berupa Karbon Dioksida (CO2) yang kita hembuskan keluar tubuh paling banyak diproduksi pada tahap...',
    options: [
      { key: 'A', text: 'Glikolisis di sitoplasma' },
      { key: 'B', text: 'Rantai Transpor Elektron di krista' },
      { key: 'C', text: 'Siklus Krebs dan Dekarboksilasi Oksidatif di mitokondria' },
      { key: 'D', text: 'Reaksi Fotolisis di kloroplas' },
      { key: 'E', text: 'Sintesis Protein di Ribosom' }
    ],
    correctAnswer: 'C',
    explanation: 'Pada respirasi seluler, gas CO2 dihasilkan dari tahap Dekarboksilasi Oksidatif (2 CO2) dan Siklus Krebs (4 CO2 per 1 molekul glukosa).'
  },
  16: {
    id: 16,
    level: 2,
    topic: 'HOTS Analogi: Turbin Bendungan & Baterai Listrik',
    question: 'Perhatikan analogi Pembangkit Listrik Tenaga Air (PLTA):\n"Air dalam waduk bendungan yang tinggi menyimpan energi potensial besar. Ketika pintu air dibuka, air mengalir deras melewati turbin generator sehingga energi aliran air diubah menjadi energi listrik dan dikemas rapi ke dalam baterai-baterai kecil (aki)."\nJika analogi ini dihubungkan dengan respirasi seluler, maka aliran air yang memutar turbin dan energi yang dikemas ke dalam baterai kecil berturut-turut setara dengan...',
    options: [
      { key: 'A', text: 'Aliran elektron/proton melalui enzim ATP Sintase; dan molekul simpanan energi ATP' },
      { key: 'B', text: 'Molekul glukosa utuh; dan gas buangan Karbon Dioksida' },
      { key: 'C', text: 'Molekul enzim katalase; dan ion kalsium di sitoplasma' },
      { key: 'D', text: 'Asam piruvat; dan gas oksigen bebas di udara' },
      { key: 'E', text: 'Sitoplasma sel; dan membran luar mitokondria' }
    ],
    correctAnswer: 'A',
    explanation: 'Aliran proton (H+) yang menuruni gradien konsentrasi memutar rotor protein ATP Sintase (seperti air memutar turbin), mengemas energi kinetik tersebut ke dalam ikatan kimia molekul ATP (seperti baterai portabel energi sel).'
  },
  17: {
    id: 17,
    level: 2,
    topic: 'HOTS Analogi: Muara Sungai & Akseptor Terakhir',
    question: 'Melanjutkan analogi bendungan air, air yang energinya telah habis digunakan memutar turbin akan dialirkan keluar dan bermuara ke hilir sungai. Pada rantai transpor elektron seluler, zat yang bertindak sebagai penangkap elektron/hidrogen terakhir dan senyawa akhir yang dibentuknya adalah...',
    options: [
      { key: 'A', text: 'Gas Karbon Dioksida (CO2) membentuk Glukosa' },
      { key: 'B', text: 'Gas Nitrogen (N2) membentuk Amonia' },
      { key: 'C', text: 'Gas Oksigen (O2) membentuk molekul Air (H2O)' },
      { key: 'D', text: 'Asam Piruvat membentuk Asam Laktat' },
      { key: 'E', text: 'Enzim ATP Sintase membentuk ADP' }
    ],
    correctAnswer: 'C',
    explanation: 'Oksigen (O2) adalah akseptor elektron terakhir dalam respirasi aerob. Oksigen mengikat elektron berenergi rendah beserta ion H+ untuk membentuk molekul air (H2O).'
  },
  18: {
    id: 18,
    level: 2,
    topic: 'Fungsi Transpor Elektron',
    question: 'Rantai transpor elektron berlangsung pada membran krista mitokondria. Fungsi utama dari sistem rantai transpor elektron adalah...',
    options: [
      { key: 'A', text: 'Mengubah energi elektron dari NADH dan FADH2 menjadi molekul energi siap pakai (ATP)' },
      { key: 'B', text: 'Memecah glukosa menjadi asam piruvat di sitosol' },
      { key: 'C', text: 'Menghasilkan gas Karbon Dioksida sebanyak-banyaknya' },
      { key: 'D', text: 'Mengikat glukosa agar tidak keluar melintasi membran sel' },
      { key: 'E', text: 'Menyimpan cadangan glukosa dalam bentuk glikogen di hati' }
    ],
    correctAnswer: 'A',
    explanation: 'Rantai transpor elektron memanfaatkan energi dari transfer elektron NADH dan FADH2 untuk memompa proton dan menghasilkan mayoritas ATP respirasi melalui fosforilasi oksidatif.'
  },
  19: {
    id: 19,
    level: 2,
    topic: 'Peran Molekul NADH & FADH2',
    question: 'Molekul NADH dan FADH2 yang dibentuk dari tahapan glikolisis, dekarboksilasi oksidatif, dan siklus Krebs berfungsi sebagai...',
    options: [
      { key: 'A', text: 'Enzim pemecah membran inti sel saat pembelahan' },
      { key: 'B', text: 'Pembawa elektron dan hidrogen berenergi tinggi menuju rantai transpor elektron' },
      { key: 'C', text: 'Bahan bakar utama yang langsung dibakar tanpa perantara' },
      { key: 'D', text: 'Racun sel yang harus segera dibuang keluar tubuh' },
      { key: 'E', text: 'Komponen pembentuk dinding sel baru pada tumbuhan' }
    ],
    correctAnswer: 'B',
    explanation: 'NADH dan FADH2 berperan sebagai koenzim pembawa elektron/hidrogen berenergi tinggi dari katabolisme glukosa menuju kompleks rantai transpor elektron.'
  },
  20: {
    id: 20,
    level: 2,
    topic: 'Total Energi ATP Respirasi Aerob',
    question: 'Secara keseluruhan, pembongkaran sempurna 1 molekul glukosa melalui seluruh tahapan respirasi aerob seluler menghasilkan energi bersih sebanyak...',
    options: [
      { key: 'A', text: '2 ATP' },
      { key: 'B', text: '4 ATP' },
      { key: 'C', text: '36 sampai 38 ATP' },
      { key: 'D', text: '100 ATP' },
      { key: 'E', text: '1 ATP' }
    ],
    correctAnswer: 'C',
    explanation: 'Satu molekul glukosa yang dioksidasi sempurna pada respirasi aerob menghasilkan sekitar 36 sampai 38 molekul ATP (tergantung sistem ulang-alik NADH di sitosol).'
  },
  21: {
    id: 21,
    level: 3,
    topic: 'Kondisi Terjadinya Respirasi Anaerob',
    question: 'Respirasi anaerob atau fermentasi akan dilakukan oleh sel apabila...',
    options: [
      { key: 'A', text: 'Ketersediaan gas Oksigen (O2) di lingkungan sel tidak mencukupi atau tidak ada' },
      { key: 'B', text: 'Suhu lingkungan sel mencapai titik beku air' },
      { key: 'C', text: 'Jumlah glukosa di dalam sel telah habis total' },
      { key: 'D', text: 'Enzim mitokondria bekerja terlalu cepat melampaui batas' },
      { key: 'E', text: 'Kadar gas Karbon Dioksida di udara terlalu rendah' }
    ],
    correctAnswer: 'A',
    explanation: 'Saat oksigen tidak ada, rantai transpor elektron terhenti. Agar sel tetap bisa menghasilkan ATP dan mendaur ulang NAD+, sel beralih ke jalur respirasi anaerob (fermentasi).'
  },
  22: {
    id: 22,
    level: 3,
    topic: 'Fermentasi Asam Laktat pada Otot',
    question: 'Saat seseorang berolahraga berat atau berlari cepat secara mendadak, sel otot melakukan respirasi anaerob yang menghasilkan zat...',
    options: [
      { key: 'A', text: 'Alkohol yang membuat otot kehilangan koordinasi' },
      { key: 'B', text: 'Asam Laktat yang menyebabkan rasa pegal dan lelah pada otot' },
      { key: 'C', text: 'Gas Karbon Dioksida yang membuat sel otot melepuh' },
      { key: 'D', text: 'Tambahan 36 ATP dalam hitungan detik' },
      { key: 'E', text: 'Gas Oksigen murni di dalam sitoplasma sel otot' }
    ],
    correctAnswer: 'B',
    explanation: 'Pada kondisi kekurangan oksigen, sel otot mamalia mereduksi asam piruvat menjadi asam laktat. Akumulasi asam laktat memicu penurunan pH lokal dan rasa lelah/pegal otot.'
  },
  23: {
    id: 23,
    level: 3,
    topic: 'Hasil Fermentasi Asam Laktat',
    question: 'Pada proses fermentasi asam laktat, pemecahan 1 molekul glukosa akan menghasilkan produk akhir berupa...',
    options: [
      { key: 'A', text: '2 molekul Asam Laktat dan 2 ATP (tanpa melepaskan gas CO2)' },
      { key: 'B', text: '2 molekul Alkohol dan 36 ATP' },
      { key: 'C', text: '2 molekul Asam Piruvat dan 4 CO2' },
      { key: 'D', text: '1 molekul Glukosa dan 2 Air' },
      { key: 'E', text: '2 molekul Asam Asetat dan Gas Oksigen' }
    ],
    correctAnswer: 'A',
    explanation: 'Fermentasi asam laktat menghasilkan 2 molekul asam laktat (3C) dan 2 ATP per glukosa, tanpa melepaskan CO2.'
  },
  24: {
    id: 24,
    level: 3,
    topic: 'Fermentasi Alkohol (Adonan Roti)',
    question: 'Dalam proses pembuatan roti menggunakan ragi (Saccharomyces), adonan roti dapat mengembang karena aktivitas fermentasi alkohol yang melepaskan...',
    options: [
      { key: 'A', text: 'Gas Oksigen (O2) yang dihasilkan dari pemecahan air' },
      { key: 'B', text: 'Gas Karbon Dioksida (CO2) yang terperangkap di dalam serat gluten adonan' },
      { key: 'C', text: 'Uap Asam Laktat yang membuat adonan berongga' },
      { key: 'D', text: 'Gas Hidrogen yang sangat ringan' },
      { key: 'E', text: 'Panas yang membakar tepung terigu secara spontan' }
    ],
    correctAnswer: 'B',
    explanation: 'Pelepasan gas CO2 saat dekarboksilasi asam piruvat menjadi asetaldehid terperangkap di dalam adonan roti sehingga membuatnya mengembang.'
  },
  25: {
    id: 25,
    level: 3,
    topic: 'Aroma Tape & Produk Alkohol',
    question: 'Pada pembuatan tape singkong atau ketan, timbul aroma khas dan rasa manis-sedikit beralkohol. Zat kimia produk fermentasi yang memberikan aroma khas tersebut adalah...',
    options: [
      { key: 'A', text: 'Asam Laktat' },
      { key: 'B', text: 'Asam Sitrat pekat' },
      { key: 'C', text: 'Etanol (Alkohol)' },
      { key: 'D', text: 'Asam Cuka (Asam Asetat murni)' },
      { key: 'E', text: 'Amilum mentah' }
    ],
    correctAnswer: 'C',
    explanation: 'Khamir ragi tape mengubah glukosa menjadi etanol (alkohol) dan gas CO2, memberikan aroma dan sensasi rasa khas tape.'
  },
  26: {
    id: 26,
    level: 3,
    topic: 'Efisiensi Energi Anaerob',
    question: 'Respirasi aerob menghasilkan energi (36–38 ATP) yang jauh lebih tinggi daripada respirasi anaerob (hanya 2 ATP). Hal ini terjadi karena pada fermentasi...',
    options: [
      { key: 'A', text: 'Glukosa tidak dibongkar secara sempurna dan sebagian besar energi masih tersimpan di produk akhir (laktat/alkohol)' },
      { key: 'B', text: 'Sel tidak menggunakan enzim metabolisme sama sekali' },
      { key: 'C', text: 'Energi ATP hancur akibat tidak adanya molekul oksigen' },
      { key: 'D', text: 'Seluruh energi diubah menjadi gas beracun bagi mitokondria' },
      { key: 'E', text: 'Glukosa langsung diubah menjadi asam amino penyusun membran' }
    ],
    correctAnswer: 'A',
    explanation: 'Pada fermentasi, rantai karbon glukosa tidak dipecah tuntas menjadi CO2 dan H2O, sehingga sebagian besar energi kimia masih tersimpan dalam ikatan molekul laktat atau etanol.'
  },
  27: {
    id: 27,
    level: 3,
    topic: 'Lokasi Fermentasi Seluler',
    question: 'Seluruh tahapan fermentasi (baik fermentasi asam laktat maupun fermentasi alkohol) berlangsung di bagian sel, yaitu...',
    options: [
      { key: 'A', text: 'Matriks Mitokondria' },
      { key: 'B', text: 'Membran Krista Mitokondria' },
      { key: 'C', text: 'Sitoplasma (Sitosol)' },
      { key: 'D', text: 'Nukleus (Inti Sel)' },
      { key: 'E', text: 'Kloroplas' }
    ],
    correctAnswer: 'C',
    explanation: 'Respirasi anaerob/fermentasi tidak melibatkan organel mitokondria, melainkan berlangsung seluruhnya di dalam sitoplasma (sitosol).'
  },
  28: {
    id: 28,
    level: 3,
    topic: 'Perbedaan Fermentasi Laktat vs Alkohol',
    question: 'Perbedaan mendasar antara fermentasi asam laktat dengan fermentasi alkohol terletak pada...',
    options: [
      { key: 'A', text: 'Fermentasi alkohol melepaskan gas CO2 dan menghasilkan etanol, sedangkan fermentasi asam laktat menghasilkan asam laktat tanpa melepaskan CO2' },
      { key: 'B', text: 'Fermentasi asam laktat menghasilkan 36 ATP, sedangkan fermentasi alkohol hanya menghasilkan 2 ATP' },
      { key: 'C', text: 'Fermentasi asam laktat membutuhkan oksigen bebas, sedangkan fermentasi alkohol tidak membutuhkan oksigen' },
      { key: 'D', text: 'Fermentasi alkohol terjadi pada sel otot manusia, sedangkan fermentasi laktat terjadi pada ragi' },
      { key: 'E', text: 'Fermentasi asam laktat terjadi di mitokondria, sedangkan fermentasi alkohol di ribosom' }
    ],
    correctAnswer: 'A',
    explanation: 'Fermentasi asam laktat tidak melepaskan gas CO2 (menghasilkan asam laktat 3C), sedangkan fermentasi alkohol melepaskan gas CO2 menghasilkan asetaldehid (2C) lalu etanol (2C).'
  },
  29: {
    id: 29,
    level: 4,
    topic: 'Tempat Reaksi Terang Fotosintesis',
    question: 'Proses fotosintesis yang membutuhkan energi cahaya matahari secara langsung (Reaksi Terang) berlangsung di bagian kloroplas, yaitu...',
    options: [
      { key: 'A', text: 'Stroma (cairan kloroplas)' },
      { key: 'B', text: 'Membran Tilakoid (Grana)' },
      { key: 'C', text: 'Membran Luar Kloroplas' },
      { key: 'D', text: 'Dinding Sel Daun' },
      { key: 'E', text: 'Sitoplasma Sel Mesofil' }
    ],
    correctAnswer: 'B',
    explanation: 'Pigmen klorofil dan fotosistem terletak pada membran tilakoid yang tersusun menjadi tumpukan grana di kloroplas.'
  },
  30: {
    id: 30,
    level: 4,
    topic: 'Peran Cahaya & Klorofil',
    question: 'Pada reaksi terang fotosintesis, fungsi utama pigmen klorofil pada daun adalah...',
    options: [
      { key: 'A', text: 'Menyerap energi foton cahaya matahari untuk mengeksitasi elektron' },
      { key: 'B', text: 'Menyerap gas Karbon Dioksida langsung dari udara bebas' },
      { key: 'C', text: 'Mengikat molekul glukosa agar tidak larut dalam air sel' },
      { key: 'D', text: 'Mencegah terjadinya penguapan air dari permukaan stomata daun' },
      { key: 'E', text: 'Membakar zat sisa metabolisme yang tidak terpakai' }
    ],
    correctAnswer: 'A',
    explanation: 'Klorofil berfungsi menangkap foton cahaya matahari untuk mengeksitasi elektron ke tingkat energi yang lebih tinggi.'
  },
  31: {
    id: 31,
    level: 4,
    topic: 'Fotolisis Air',
    question: 'Reaksi pemecahan molekul air (H2O) dengan bantuan energi cahaya pada reaksi terang fotosintesis dinamakan fotolisis. Hasil dari fotolisis air tersebut adalah...',
    options: [
      { key: 'A', text: 'Gas Karbon Dioksida (CO2) dan Glukosa' },
      { key: 'B', text: 'Gas Oksigen (O2), ion Hidrogen (H+), dan elektron' },
      { key: 'C', text: 'Asam Piruvat dan molekul ATP' },
      { key: 'D', text: 'Molekul Amilum dan Air baru' },
      { key: 'E', text: 'Gas Nitrogen dan Oksigen' }
    ],
    correctAnswer: 'B',
    explanation: 'Fotolisis air: 2 H2O -> 4 H+ + 4 e- + O2. Oksigen dilepas ke udara, sedangkan H+ dan elektron digunakan dalam reaksi fotosintesis.'
  },
  32: {
    id: 32,
    level: 4,
    topic: 'Asal-Usul Gas Oksigen Fotosintesis',
    question: 'Gas oksigen (O2) yang dihasilkan oleh tumbuhan hijau dan sangat bermanfaat bagi pernapasan makhluk hidup di bumi sebenarnya berasal dari...',
    options: [
      { key: 'A', text: 'Penguraian gas Karbon Dioksida (CO2) pada reaksi gelap' },
      { key: 'B', text: 'Pemecahan molekul Air (H2O) pada reaksi terang' },
      { key: 'C', text: 'Pembongkaran cadangan amilum pada malam hari' },
      { key: 'D', text: 'Reaksi molekul glukosa dengan udara di stroma' },
      { key: 'E', text: 'Penguapan air tanah melalui pori-pori stomata' }
    ],
    correctAnswer: 'B',
    explanation: 'Berdasarkan bukti ilmiah (percobaan Ruben dan Kamen), molekul O2 yang dibebaskan tumbuhan berasal dari fotolisis molekul air (H2O), bukan dari pemecahan CO2.'
  },
  33: {
    id: 33,
    level: 4,
    topic: 'Produk Reaksi Terang untuk Siklus Calvin',
    question: 'Reaksi terang menghasilkan dua senyawa berenergi tinggi yang mutlak dibutuhkan untuk menjalankan reaksi gelap (Siklus Calvin). Dua senyawa tersebut adalah...',
    options: [
      { key: 'A', text: 'Glukosa dan Gas Oksigen' },
      { key: 'B', text: 'Karbon Dioksida dan Air' },
      { key: 'C', text: 'ATP dan NADPH' },
      { key: 'D', text: 'Asam Piruvat dan FADH2' },
      { key: 'E', text: 'RuBP dan Asam Sitrat' }
    ],
    correctAnswer: 'C',
    explanation: 'Reaksi terang menyediakan energi berupa ATP dan daya pereduksi berupa NADPH yang digunakan pada tahap reduksi dan regenerasi Siklus Calvin.'
  },
  34: {
    id: 34,
    level: 4,
    topic: 'Enzim ATP Sintase Tilakoid',
    question: 'Pada membran tilakoid, pembentukan molekul ATP dari ADP dan fosfat anorganik terjadi saat ion hidrogen (proton) mengalir melewati enzim khusus bernama...',
    options: [
      { key: 'A', text: 'Katalase' },
      { key: 'B', text: 'ATP Sintase' },
      { key: 'C', text: 'Amilase' },
      { key: 'D', text: 'Rubisco' },
      { key: 'E', text: 'Peptidase' }
    ],
    correctAnswer: 'B',
    explanation: 'Sintesis ATP secara kemiosmosis dikatalisis oleh enzim ATP Sintase saat proton mengalir menuruni gradien elektrokimia dari lumen tilakoid ke stroma.'
  },
  35: {
    id: 35,
    level: 4,
    topic: 'Keterkaitan Reaksi Terang & Gelap',
    question: 'Jika suatu tanaman diletakkan di ruangan yang gelap total secara terus-menerus, reaksi gelap (Siklus Calvin) pada akhirnya juga akan terhenti karena...',
    options: [
      { key: 'A', text: 'Pasokan ATP dan NADPH dari reaksi terang telah habis' },
      { key: 'B', text: 'Pigmen klorofil hilang menguap dari daun' },
      { key: 'C', text: 'Daun tidak mampu lagi menyerap gas oksigen dari udara' },
      { key: 'D', text: 'Cairan stroma kloroplas membeku seketika tanpa cahaya' },
      { key: 'E', text: 'Glukosa berubah sifat menjadi racun bagi sel tumbuhan' }
    ],
    correctAnswer: 'A',
    explanation: 'Meskipun reaksi gelap tidak memerlukan foton cahaya langsung, reaksi ini bergantung sepenuhnya pada ATP dan NADPH yang dipasok oleh reaksi terang.'
  },
  36: {
    id: 36,
    level: 5,
    topic: 'Tempat Reaksi Gelap (Siklus Calvin)',
    question: 'Reaksi gelap fotosintesis (Siklus Calvin) yang tidak membutuhkan cahaya matahari secara langsung berlangsung di bagian kloroplas, yaitu...',
    options: [
      { key: 'A', text: 'Membran Tilakoid' },
      { key: 'B', text: 'Grana' },
      { key: 'C', text: 'Stroma (cairan kloroplas)' },
      { key: 'D', text: 'Membran Luar Kloroplas' },
      { key: 'E', text: 'Ribosom Kloroplas' }
    ],
    correctAnswer: 'C',
    explanation: 'Siklus Calvin terjadi di dalam stroma, yaitu matriks cairan kloroplas yang kaya akan enzim-enzim fiksasi dan reduksi karbon.'
  },
  37: {
    id: 37,
    level: 5,
    topic: 'Fiksasi Karbon & Enzim Rubisco',
    question: 'Pada tahap awal Siklus Calvin (Fiksasi Karbon), gas Karbon Dioksida (CO2) dari atmosfer diikat oleh senyawa berkarbon 5 (RuBP) dengan bantuan enzim utama tumbuhan bernama...',
    options: [
      { key: 'A', text: 'Katalase' },
      { key: 'B', text: 'Pepsin' },
      { key: 'C', text: 'Rubisco (RuBP Karboksilase)' },
      { key: 'D', text: 'Tripsin' },
      { key: 'E', text: 'Lipase' }
    ],
    correctAnswer: 'C',
    explanation: 'Enzim Rubisco (Ribulosa 1,5-bifosfat karboksilase-oksigenase) mengkatalisis pengikatan CO2 ke RuBP (5C) untuk membentuk senyawa intermediet yang terpecah menjadi PGA (3C).'
  },
  38: {
    id: 38,
    level: 5,
    topic: 'Tahap Reduksi Siklus Calvin',
    question: 'Pada tahap reduksi dalam Siklus Calvin, molekul PGA (asam fosfogliserat) diubah menjadi molekul berenergi tinggi PGAL (G3P) dengan menggunakan bantuan energi dari...',
    options: [
      { key: 'A', text: 'ATP dan NADPH hasil reaksi terang' },
      { key: 'B', text: 'Gas Oksigen dan molekul Air' },
      { key: 'C', text: 'Foton cahaya matahari langsung' },
      { key: 'D', text: 'Enzim Katalase dari sel hati' },
      { key: 'E', text: 'Asam Laktat dan gas Karbon Dioksida' }
    ],
    correctAnswer: 'A',
    explanation: 'ATP memberikan gugus fosfat dan NADPH mendonorkan elektron/hidrogen untuk mereduksi 3-PGA menjadi PGAL (G3P).'
  },
  39: {
    id: 39,
    level: 5,
    topic: 'Tahap Regenerasi RuBP',
    question: 'Pada akhir Siklus Calvin, sebagian besar molekul PGAL (G3P) yang terbentuk akan digunakan kembali untuk membentuk molekul RuBP agar siklus dapat terus berlangsung. Tahap ini disebut tahap...',
    options: [
      { key: 'A', text: 'Fiksasi Karbon' },
      { key: 'B', text: 'Regenerasi RuBP' },
      { key: 'C', text: 'Glikolisis Sitosol' },
      { key: 'D', text: 'Fotolisis Klorofil' },
      { key: 'E', text: 'Fermentasi Karbohidrat' }
    ],
    correctAnswer: 'B',
    explanation: 'Tahap regenerasi menggunakan molekul PGAL (didukung ATP) untuk menyusun kembali molekul penerima CO2 yaitu Ribulosa Bifosfat (RuBP).'
  },
  40: {
    id: 40,
    level: 5,
    topic: 'Hasil Akhir Sintesis Glukosa',
    question: 'Molekul karbohidrat/gula sederhana (Glukosa) yang menjadi sumber makanan utama bagi tumbuhan dan makhluk hidup lainnya dibentuk secara langsung pada tahap...',
    options: [
      { key: 'A', text: 'Reaksi Terang dari pemecahan molekul air' },
      { key: 'B', text: 'Rantai Transpor Elektron di krista mitokondria' },
      { key: 'C', text: 'Glikolisis di dalam sitoplasma' },
      { key: 'D', text: 'Reaksi Gelap (Siklus Calvin) dari penggabungan molekul PGAL (G3P)' },
      { key: 'E', text: 'Fotolisis klorofil di membran tilakoid' }
    ],
    correctAnswer: 'D',
    explanation: 'Dua molekul PGAL (G3P) berkarbon 3 yang dikeluarkan dari Siklus Calvin akan digabungkan di stroma/sitoplasma untuk membentuk 1 molekul glukosa (6C).'
  }
};
