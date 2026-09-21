import { Organism, Question, LevelConfig } from '../types/kehati';

export const ORGANISMS_DATABASE: Organism[] = [
  // ORIENTAL (ASIATIS)
  {
    id: 'orangutan',
    name: 'Orangutan Sumatera',
    scientificName: 'Pongo abelii',
    type: 'fauna',
    level: 'Spesies',
    zone: 'Oriental',
    status: 'Kritis (CR)',
    habitat: 'Hutan Hujan Tropis Dataran Rendah Sumatera',
    description: 'Primata arboreal terbesar di dunia yang menghabiskan hampir 90% waktunya di atas tajuk pohon.',
    funFact: 'Orangutan memiliki kemiripan DNA hingga 97% dengan manusia dan berperan sebagai penyebar biji hutan vital (gardener of the rainforest).',
    icon: '🦧',
    threats: ['Deforestasi kelapa sawit', 'Perburuan liar', 'Kebakaran hutan'],
    conservationEffort: 'Rehabilitasi di Taman Nasional Gunung Leuser dan perlindungan koridor hutan.'
  },
  {
    id: 'harimau_sumatera',
    name: 'Harimau Sumatera',
    scientificName: 'Panthera tigris sumatrae',
    type: 'fauna',
    level: 'Spesies',
    zone: 'Oriental',
    status: 'Kritis (CR)',
    habitat: 'Hutan Hujan Tropis Sumatera',
    description: 'Subspesies harimau terkecil yang masih bertahan, memiliki loreng paling rapat dan warna oranye paling gelap.',
    funFact: 'Memiliki selaput di antara jari-jari kakinya yang menjadikannya perenang handal untuk mengejar mangsa di air.',
    icon: '🐅',
    threats: ['Perburuan untuk bagian tubuh', 'Fragmentasi habitat', 'Konflik dengan manusia'],
    conservationEffort: 'Patroli SMART di Taman Nasional Kerinci Seblat dan Bukit Barisan Selatan.'
  },
  {
    id: 'rafflesia',
    name: 'Padma Raksasa (Rafflesia)',
    scientificName: 'Rafflesia arnoldii',
    type: 'flora',
    level: 'Spesies',
    zone: 'Oriental',
    status: 'Kritis (CR)',
    habitat: 'Hutan primer Bengkulu & Sumatera',
    description: 'Tumbuhan parasit obligat tanpa daun, akar, maupun batang sejati. Memiliki bunga tunggal terbesar di dunia (diameter hingga 1 meter).',
    funFact: 'Mengeluarkan bau busuk seperti bangkai untuk menarik lalat (Lucilia) guna membantu proses penyerbukan.',
    icon: '🌺',
    threats: ['Kerusakan inang Tetrastigma', 'Ekowisata tidak terkendali', 'Pengeringan kuncup'],
    conservationEffort: 'Kawasan konservasi bunga Rafflesia di Cagar Alam Taba Penanjung Bengkulu.'
  },
  {
    id: 'kantong_semar',
    name: 'Kantong Semar Katingan',
    scientificName: 'Nepenthes klossii',
    type: 'flora',
    level: 'Gen',
    zone: 'Oriental',
    status: 'Genting (EN)',
    habitat: 'Hutan gambut dan dataran tinggi Kalimantan',
    description: 'Tumbuhan karnivora pemakan serangga yang memodifikasi ujung daunnya menjadi kantong penjebak berisi cairan enzim pencerna.',
    funFact: 'Variasi bentuk kantong bawah dan kantong atas menunjukkan tingginya keanekaragaman genetik dalam satu genus Nepenthes.',
    icon: '🪴',
    threats: ['Konversi lahan gambut', 'Pencurian tanaman hias liar'],
    conservationEffort: 'Budidaya ex-situ di Kebun Raya Bogor dan konservasi in-situ hutan lindung.'
  },

  // PERALIHAN (WALLACEA)
  {
    id: 'komodo',
    name: 'Komodo',
    scientificName: 'Varanus komodoensis',
    type: 'fauna',
    level: 'Spesies',
    zone: 'Peralihan',
    status: 'Genting (EN)',
    habitat: 'Savana dan hutan gugur Pulau Komodo, Rinca, Flores',
    description: 'Kadal terbesar di muka bumi dengan panjang mencapai 3 meter dan berat hingga 70 kg.',
    funFact: 'Komodo memiliki kelenjar bisa (venom) kompleks di rahang bawahnya yang mencegah pembekuan darah mangsa.',
    icon: '🦎',
    threats: ['Perubahan iklim menaikkan permukaan laut', 'Perburuan mangsa rusa liar', 'Pariwisata massal'],
    conservationEffort: 'Taman Nasional Komodo sebagai Situs Warisan Dunia UNESCO.'
  },
  {
    id: 'anoa',
    name: 'Anoa Dataran Rendah',
    scientificName: 'Bubalus depressicornis',
    type: 'fauna',
    level: 'Spesies',
    zone: 'Peralihan',
    status: 'Genting (EN)',
    habitat: 'Hutan primer dan rawa Sulawesi',
    description: 'Banteng kerdil endemik Sulawesi yang hidup soliter atau berpasangan.',
    funFact: 'Sering dijuluki "sapi hutan kerdil" dan hanya ditemukan secara alami di pulau Sulawesi dan Buton.',
    icon: '🐂',
    threats: ['Perburuan daging semak', 'Perambahan tambang nikel dan kebun'],
    conservationEffort: 'Suaka Marga Satwa Nantu dan Anoa Breeding Centre di Manado.'
  },
  {
    id: 'burung_maleo',
    name: 'Burung Maleo Senkawor',
    scientificName: 'Macrocephalon maleo',
    type: 'fauna',
    level: 'Spesies',
    zone: 'Peralihan',
    status: 'Kritis (CR)',
    habitat: 'Hutan bukit dan pantai pasir vulkanik Sulawesi',
    description: 'Burung unik yang tidak mengerami telurnya dengan tubuhnya melainkan menguburnya di tanah berpasir panas bumi (geotermal).',
    funFact: 'Ukuran satu butir telur Maleo mencapai 5-8 kali ukuran telur ayam biasa, dan anak burung langsung bisa terbang begitu menggali keluar dari pasir!',
    icon: '🦃',
    threats: ['Pencurian telur oleh manusia', 'Predasi biawak dan anjing liar'],
    conservationEffort: 'Penetasan semi-alami di Taman Nasional Bogani Nani Wartabone.'
  },
  {
    id: 'cendana',
    name: 'Pohon Cendana Wangi',
    scientificName: 'Santalum album',
    type: 'flora',
    level: 'Ekosistem',
    zone: 'Peralihan',
    status: 'Rentan (VU)',
    habitat: 'Savana dan hutan kering Nusa Tenggara Timur',
    description: 'Pohon hemiparasit akar penghasil kayu dan minyak atsiri bernilai ekonomi sangat tinggi beraroma khas.',
    funFact: 'Akarnya memerlukan pohon inang (seperti akasia atau inang lain) untuk menyerap nutrisi selama tahap awal pertumbuhan.',
    icon: '🪵',
    threats: ['Eksploitasi berlebih di masa lalu', 'Kebakaran sabana berulang'],
    conservationEffort: 'Perkebunan benih unggul dan perlindungan hutan adat di Timor Barat.'
  },

  // AUSTRALIS
  {
    id: 'cenderawasih',
    name: 'Cenderawasih Kuning Besar',
    scientificName: 'Paradisaea apoda',
    type: 'fauna',
    level: 'Spesies',
    zone: 'Australis',
    status: 'Risiko Rendah (LC)',
    habitat: 'Hutan Hujan Tropis Dataran Rendah Papua & Kepulauan Aru',
    description: 'Burung yang dijuluki "Bird of Paradise" karena keindahan bulu hias jantan yang memukau untuk ritual kawin (lek display).',
    funFact: 'Nama ilmiah "apoda" berarti "tanpa kaki" karena spesimen pertama yang dibawa ke Eropa dipotong kakinya oleh pemburu lokal sehingga timbul mitos burung ini terbang abadi di surga.',
    icon: '🦜',
    threats: ['Perburuan mahkota adat', 'Pembalakan liar hutan adat'],
    conservationEffort: 'Ekowisata berbasis masyarakat di Tambrauw dan Nimbokrang Papua.'
  },
  {
    id: 'kanguru_pohon',
    name: 'Kanguru Pohon Mantel Emas',
    scientificName: 'Dendrolagus pulcherrimus',
    type: 'fauna',
    level: 'Spesies',
    zone: 'Australis',
    status: 'Kritis (CR)',
    habitat: 'Hutan pegunungan terisolasi Pegunungan Foja, Papua',
    description: 'Marsupial (hewan berkantung) yang beradaptasi hidup di pepohonan dengan cakar kuat dan ekor panjang penyeimbang.',
    funFact: 'Ditemukan pertama kali pada tahun 1990 dan dianggap sebagai salah satu marsupial terindah di dunia.',
    icon: '🦘',
    threats: ['Perburuan tradisional berlebih', 'Fragmentasi habitat'],
    conservationEffort: 'Kawasan Lindung Konservasi YUS dan Suaka Margasatwa Pegunungan Foja.'
  },
  {
    id: 'kasuari',
    name: 'Kasuari Gelambir Ganda',
    scientificName: 'Casuarius casuarius',
    type: 'fauna',
    level: 'Spesies',
    zone: 'Australis',
    status: 'Risiko Rendah (LC)',
    habitat: 'Hutan Hujan Lebat Papua',
    description: 'Burung raksasa tak dapat terbang dengan helm tanduk (casque) di kepala untuk menembus semak lebat.',
    funFact: 'Kasuari adalah hewan kunci pemencar biji pohon hutan Papua berkulit tebal yang tidak bisa dicerna hewan lain.',
    icon: '🦤',
    threats: ['Jerat liar', 'Pembangunan jalan membelah hutan'],
    conservationEffort: 'Taman Nasional Lorentz (Situs Warisan Dunia UNESCO terbesar di Asia Tenggara).'
  },
  {
    id: 'matoa',
    name: 'Pohon Matoa',
    scientificName: 'Pometia pinnata',
    type: 'flora',
    level: 'Ekosistem',
    zone: 'Australis',
    status: 'Risiko Rendah (LC)',
    habitat: 'Hutan tropis lembap Papua dan Maluku',
    description: 'Pohon buah khas Papua dengan rasa unik kombinasi antara kelengkeng, rambutan, dan durian.',
    funFact: 'Pohon matoa sangat toleran terhadap genangan air berkala dan menjadi kanopi penyerap karbon yang kuat.',
    icon: '🌳',
    threats: ['Penebangan untuk kayu pertukangan'],
    conservationEffort: 'Budidaya tanaman pekarangan rakyat dan hutan kemasyarakatan.'
  },

  // BAHARI & PESISIR
  {
    id: 'penyu_hijau',
    name: 'Penyu Hijau',
    scientificName: 'Chelonia mydas',
    type: 'fauna',
    level: 'Spesies',
    zone: 'Bahari',
    status: 'Genting (EN)',
    habitat: 'Padang lamun dan terumbu karang perairan tropis Indonesia',
    description: 'Reptil laut herbivora pemakan lamun dan alga yang membantu menjaga kesehatan padang lamun.',
    funFact: 'Penyu betina akan kembali bertelur ke pantai tempat ia dilahirkan berpuluh tahun kemudian menggunakan navigasi medan magnet bumi!',
    icon: '🐢',
    threats: ['Pencurian telur', 'Tertelan plastik yang dikira ubur-ubur', 'Bycatch jaring nelayan'],
    conservationEffort: 'Kawasan Konservasi Perairan Daerah Kepulauan Derawan & Berau.'
  },
  {
    id: 'manta_karang',
    name: 'Pari Manta Karang',
    scientificName: 'Mobula alfredi',
    type: 'fauna',
    level: 'Spesies',
    zone: 'Bahari',
    status: 'Rentan (VU)',
    habitat: 'Perairan karang dangkal Raja Ampat, Nusa Penida, Komodo',
    description: 'Ikan pari raksasa pemakan plankton yang ramah tanpa duri sengat beracun.',
    funFact: 'Pola bercak hitam-putih di bagian perut (ventral) manta bersifat unik seperti sidik jari manusia.',
    icon: '🐟',
    threats: ['Perburuan lempeng insang untuk obat tradisional', 'Sampah mikroplastik'],
    conservationEffort: 'Suaka Pari Manta Nasional di seluruh ZEE Indonesia (Kepmen KP No. 4/2014).'
  },
  {
    id: 'karang_acropora',
    name: 'Karang Meja Acropora',
    scientificName: 'Acropora hyacinthus',
    type: 'fauna',
    level: 'Ekosistem',
    zone: 'Bahari',
    status: 'Hampir Terancam (NT)',
    habitat: 'Laguna dan lereng terumbu karang Segitiga Karang Dunia',
    description: 'Hewan karang pembangun terumbu (koral hermatipik) yang bersimbiosis mutualisme dengan mikroalga zooxanthellae.',
    funFact: 'Indonesia merupakan pusat Segitiga Karang Dunia (Coral Triangle) dengan lebih dari 590 spesies karang keras (76% dari seluruh dunia).',
    icon: '🪸',
    threats: ['Pemutihan karang (coral bleaching) akibat kenaikan suhu laut', 'Pengeboman ikan', 'Sedimentasi'],
    conservationEffort: 'Transplantasi karang berbasis bioreef dan Kawasan Suaka Alam Perairan Raja Ampat.'
  },
  {
    id: 'mangrove_bakau',
    name: 'Hutan Bakau Kurap',
    scientificName: 'Rhizophora mucronata',
    type: 'flora',
    level: 'Ekosistem',
    zone: 'Bahari',
    status: 'Risiko Rendah (LC)',
    habitat: 'Zona pasang surut berlumpur pesisir tropis',
    description: 'Pohon pantai berakar tunjang (stilt roots) yang berfungsi sebagai benteng abrasi, perangkap sedimen, dan nursery ground ikan.',
    funFact: 'Hutan mangrove Indonesia mampu menyimpan karbon 3-5 kali lebih banyak dibandingkan hutan tropis daratan (Blue Carbon).',
    icon: '🌱',
    threats: ['Konversi menjadi tambak udang intensif', 'Pencemaran limbah industri'],
    conservationEffort: 'Rehabilitasi mangrove nasional oleh Badan Restorasi Gambut dan Mangrove (BRGM).'
  }
];

export const KEHATI_QUESTIONS: Question[] = [
  {
    id: 'q1',
    question: 'Variasi warna bunga mawar (merah, putih, kuning) atau variasi rasa buah mangga (arumanis, manalagi, golek) merupakan contoh dari keanekaragaman tingkat apa?',
    options: [
      'Tingkat Gen',
      'Tingkat Spesies/Jenis',
      'Tingkat Ekosistem',
      'Tingkat Filum'
    ],
    correctAnswer: 0,
    explanation: 'Keanekaragaman tingkat gen terjadi karena perbedaan susunan basa nitrogen dalam DNA pada individu-individu yang masih termasuk dalam SATU SPESIES yang sama.',
    topic: 'Tingkat Gen'
  },
  {
    id: 'q2',
    question: 'Kucing, harimau, singa, dan macan tutul berada dalam famili yang sama (Felidae) namun berbeda spesies. Hal ini menunjukkan contoh keanekaragaman...',
    options: [
      'Tingkat Genetik',
      'Tingkat Spesies / Jenis',
      'Tingkat Ekosistem',
      'Tingkat Biosfer'
    ],
    correctAnswer: 1,
    explanation: 'Keanekaragaman spesies menunjukkan variasi antara organisme yang berbeda jenis/spesies dalam satu genus atau satu famili.',
    topic: 'Tingkat Spesies'
  },
  {
    id: 'q3',
    question: 'Garis khayal yang membatasi wilayah persebaran fauna Oriental (Asiatis) dengan wilayah fauna Peralihan (Wallacea) di Indonesia disebut...',
    options: [
      'Garis Weber',
      'Garis Wallace',
      'Garis Khatulistiwa',
      'Garis Lydekker'
    ],
    correctAnswer: 1,
    explanation: 'Garis Wallace (ditarik oleh Alfred Russel Wallace) memisahkan Paparan Sunda (Sumatera, Jawa, Bali, Kalimantan) dengan kawasan Kepulauan Wallacea (Sulawesi, Nusa Tenggara).',
    topic: 'Garis Wallace-Weber'
  },
  {
    id: 'q4',
    question: 'Hewan endemik Sulawesi yang memiliki ciri khas gigi taring melengkung ke atas menembus kulit moncongnya pada jantan adalah...',
    options: [
      'Orangutan',
      'Babirusa',
      'Kasuari',
      'Badak Jawa'
    ],
    correctAnswer: 1,
    explanation: 'Babirusa (Babyrousa babyrussa) adalah satwa endemik pulau Sulawesi yang terkenal dengan taring khasnya.',
    topic: 'Tingkat Spesies'
  },
  {
    id: 'q5',
    question: 'Pelestarian Badak Jawa di Taman Nasional Ujung Kulon dan Komodo di TN Komodo merupakan contoh bentuk konservasi...',
    options: [
      'Konservasi Ex-Situ',
      'Konservasi In-Situ',
      'Konservasi Domestikasi',
      'Konservasi Hibridisasi'
    ],
    correctAnswer: 1,
    explanation: 'Konservasi In-Situ adalah pelestarian keanekaragaman hayati yang dilakukan di dalam habitat aslinya (seperti Taman Nasional, Suaka Margasatwa, Cagar Alam).',
    topic: 'Konservasi'
  },
  {
    id: 'q6',
    question: 'Penyimpanan plasma nutfah tanaman langka di Kebun Raya Bogor atau Bank Sperma hewan langka di Taman Safari termasuk metode...',
    options: [
      'Konservasi Ex-Situ',
      'Konservasi In-Situ',
      'Restorasi Ekologi',
      'Suksesi Primer'
    ],
    correctAnswer: 0,
    explanation: 'Konservasi Ex-Situ adalah usaha pelestarian keanekaragaman hayati di luar habitat aslinya (misal: Kebun Raya, Kebun Binatang, Herbarium, Cryopreservation).',
    topic: 'Konservasi'
  },
  {
    id: 'q7',
    question: 'Mengapa Indonesia dijuluki negara "Megabiodiversitas" (Megabiodiversity Country)?',
    options: [
      'Karena memiliki tambang batubara dan minyak bumi terbanyak',
      'Karena terletak di garis khatulistiwa dengan keanekaragaman flora, fauna, dan ekosistem terkaya di dunia',
      'Karena memiliki jumlah penduduk terbesar di benua Asia',
      'Karena semua hewannya jinak dan dapat diternakkan'
    ],
    correctAnswer: 1,
    explanation: 'Indonesia memiliki 10% spesies tumbuhan dunia, 12% mamalia dunia, 17% burung dunia, dan pusat Segitiga Terumbu Karang Dunia karena iklim tropis dan posisi biogeografis unik.',
    topic: 'Tingkat Ekosistem'
  },
  {
    id: 'q8',
    question: 'Ancaman utama yang menyebabkan penurunan populasi Orangutan dan Harimau Sumatera secara drastis adalah...',
    options: [
      'Evolusi alami spesies',
      'Alih fungsi hutan alam menjadi perkebunan monokultur & fragmentasi habitat',
      'Kelebihan pasokan makanan di alam liar',
      'Musim hujan yang terlalu panjang'
    ],
    correctAnswer: 1,
    explanation: 'Hilangnya habitat akibat deforestasi dan fragmentasi memisahkan populasi satwa, memicu kelangkaan pakan dan konflik satwa-manusia.',
    topic: 'Ancaman Kehati'
  },
  {
    id: 'q9',
    question: 'Ciri-ciri fauna yang termasuk dalam Zona Australis (Papua & Maluku) antara lain adalah...',
    options: [
      'Banyak mamalia besar bertanduk dan kera berkantung pipi',
      'Terdapat hewan berkantung (marsupialia) dan burung dengan bulu aneka warna indah',
      'Hanya dihuni oleh reptil raksasa karnivora',
      'Tidak ada burung yang bisa berkicau'
    ],
    correctAnswer: 1,
    explanation: 'Fauna Australis bercirikan keberadaan mamalia berkantung (seperti kuskus, kanguru pohon) serta burung bulu indah (Cenderawasih, Kasuari, Nuri Sayap Hitam).',
    topic: 'Garis Wallace-Weber'
  },
  {
    id: 'q10',
    question: 'Fenomena pemutihan karang (coral bleaching) di perairan laut Indonesia terutama dipicu oleh...',
    options: [
      'Kenaikan suhu rata-rata air laut yang menyebabkan lepasnya mikroalga zooxanthellae dari jaringan polip karang',
      'Air laut yang terlalu banyak mengandung kalsium alami',
      'Penyelaman snorkelling tanpa pelampung',
      'Cahaya bulan purnama di malam hari'
    ],
    correctAnswer: 0,
    explanation: 'Saat suhu air laut meningkat di atas ambang toleransi, stres termal membuat karang mengeluarkan zooxanthellae (simbion fotosintesisnya), menyisakan rangka kapur putih transparan.',
    topic: 'Ancaman Kehati'
  }
];

export const GAME_LEVELS: LevelConfig[] = [
  {
    id: 'level-1',
    title: 'Hutan Hujan Tropis Sundaland',
    subtitle: 'Zona Oriental (Asiatis) - Sumatera & Kalimantan',
    zone: 'Oriental',
    themeColor: '#059669', // Emerald
    badge: '🌿 Primata & Flora Kanopi',
    description: 'Jelajahi labirin lebat hutan primer Sumatera dan Kalimantan. Temukan Orangutan, Harimau Sumatera, Rafflesia raksasa, dan atasi rintangan penebangan liar!',
    mazeSize: { width: 11, height: 9 },
    targetSpecimens: 3,
    targetQuestions: 2,
    unlockedByDefault: true
  },
  {
    id: 'level-2',
    title: 'Kepulauan Endemik Wallacea',
    subtitle: 'Zona Peralihan - Sulawesi & Nusa Tenggara',
    zone: 'Peralihan',
    themeColor: '#D97706', // Amber
    badge: '🦎 Fosil Hidup & Savana Kering',
    description: 'Menyusuri labirin perbukitan karst dan sabana Nusa Tenggara serta Sulawesi. Temukan Komodo sang naga purba, Anoa, dan Maleo di sarang geotermal!',
    mazeSize: { width: 13, height: 11 },
    targetSpecimens: 3,
    targetQuestions: 2,
    unlockedByDefault: false
  },
  {
    id: 'level-3',
    title: 'Surga Satwa Sahul',
    subtitle: 'Zona Australis - Hutan Belantara Papua',
    zone: 'Australis',
    themeColor: '#7C3AED', // Violet
    badge: '🦜 Burung Surga & Marsupialia',
    description: 'Tembus kabut pegunungan dan kanopi hutan Papua yang lebat. Selamatkan Cenderawasih, Kasuari, dan Kanguru Pohon Mantel Emas dari jerat pemburu!',
    mazeSize: { width: 15, height: 11 },
    targetSpecimens: 3,
    targetQuestions: 3,
    unlockedByDefault: false
  },
  {
    id: 'level-4',
    title: 'Segitiga Terumbu Karang Bahari',
    subtitle: 'Zona Laut & Pesisir Blue Carbon',
    zone: 'Bahari',
    themeColor: '#0284C7', // Sky Blue
    badge: '🪸 Pusat Karang Dunia',
    description: 'Selami labirin atol karang dan padang lamun nusantara. Bersihkan sampah plastik laut, selamatkan Penyu Hijau, Pari Manta, dan restorasi bakau pesisir!',
    mazeSize: { width: 17, height: 13 },
    targetSpecimens: 4,
    targetQuestions: 3,
    unlockedByDefault: false
  }
];
