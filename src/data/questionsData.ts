import { Question } from '../types/exam';

export const QUESTIONS_DATA: Record<number, Question> = {
  1: {
    id: 1,
    level: 15,
    topic: 'Ancaman & Konservasi Perairan',
    question: 'Pembuangan limbah industri secara langsung ke sungai dapat mengancam keanekaragaman hayati perairan karena...',
    options: [
      { key: 'A', text: 'Menurunkan kadar oksigen terlarut dan meracuni organisme air' },
      { key: 'B', text: 'Meningkatkan populasi ikan secara drastis' },
      { key: 'C', text: 'Mempercepat pertumbuhan terumbu karang' },
      { key: 'D', text: 'Tidak berdampak pada rantai makanan perairan' },
      { key: 'E', text: 'Meningkatkan kejernihan air sungai' }
    ],
    correctAnswer: 'A',
    explanation: 'Limbah industri mengandung zat kimia toksik dan bahan organik yang memicu peningkatan Biochemical Oxygen Demand (BOD), sehingga menurunkan kadar oksigen terlarut (DO) dan meracuni biota perairan.'
  },
  2: {
    id: 2,
    level: 15,
    topic: 'Pelestarian Berkelanjutan',
    question: 'Salah satu strategi pelestarian keanekaragaman hayati secara berkelanjutan yang melibatkan masyarakat sekitar kawasan konservasi adalah...',
    options: [
      { key: 'A', text: 'Melarang total akses masyarakat tanpa alternatif ekonomi' },
      { key: 'B', text: 'Mengembangkan ekowisata dan pemanfaatan sumber daya secara lestari yang melibatkan masyarakat lokal' },
      { key: 'C', text: 'Mengubah kawasan konservasi menjadi lahan pertanian' },
      { key: 'D', text: 'Membiarkan perburuan liar berlangsung' },
      { key: 'E', text: 'Menghapus status kawasan lindung' }
    ],
    correctAnswer: 'B',
    explanation: 'Konservasi berbasis masyarakat (community-based conservation) seperti ekowisata dan pemanfaatan Hasil Hutan Bukan Kayu (HHBK) secara lestari memberikan insentif ekonomi bagi warga lokal untuk ikut menjaga kelestarian hutan.'
  },
  3: {
    id: 3,
    level: 14,
    topic: 'Kawasan Konservasi & Cagar Biosfer',
    question: 'Pembentukan kawasan cagar biosfer (biosphere reserve) oleh UNESCO bertujuan untuk...',
    options: [
      { key: 'A', text: 'Melindungi ekosistem sekaligus mendukung pembangunan berkelanjutan bagi masyarakat sekitar' },
      { key: 'B', text: 'Menghentikan seluruh aktivitas manusia di suatu wilayah' },
      { key: 'C', text: 'Mengubah kawasan hutan menjadi kawasan industri' },
      { key: 'D', text: 'Menghapus status kawasan lindung yang sudah ada' },
      { key: 'E', text: 'Membatasi penelitian ilmiah di kawasan konservasi' }
    ],
    correctAnswer: 'A',
    explanation: 'Cagar biosfer UNESCO memiliki 3 zona (inti, penyangga, transisi) yang menyeimbangkan antara konservasi keanekaragaman hayati dan pembangunan sosial-ekonomi berkelanjutan.'
  },
  4: {
    id: 4,
    level: 13,
    topic: 'Pelestarian Ex-Situ',
    question: 'Upaya pelestarian keanekaragaman hayati di luar habitat aslinya disebut pelestarian ex-situ, contohnya...',
    options: [
      { key: 'A', text: 'Taman nasional' },
      { key: 'B', text: 'Suaka margasatwa' },
      { key: 'C', text: 'Kebun binatang dan kebun raya' },
      { key: 'D', text: 'Cagar alam' },
      { key: 'E', text: 'Hutan lindung' }
    ],
    correctAnswer: 'C',
    explanation: 'Pelestarian ex-situ dilakukan di luar habitat asli spesies, seperti di Kebun Raya (Bogor, Cibodas) untuk tumbuhan dan Kebun Binatang / Taman Safari untuk satwa.'
  },
  5: {
    id: 5,
    level: 14,
    topic: 'Keanekaragaman Hayati Tingkat Gen',
    question: 'Keanekaragaman hayati tingkat gen dapat diamati dari...',
    options: [
      { key: 'A', text: 'Perbedaan warna bulu pada kucing dalam satu spesies' },
      { key: 'B', text: 'Perbedaan antara ayam dan itik' },
      { key: 'C', text: 'Perbedaan ekosistem hutan hujan tropis dan gurun' },
      { key: 'D', text: 'Perbedaan struktur tanah di berbagai daerah' },
      { key: 'E', text: 'Perbedaan iklim tropis dan subtropis' }
    ],
    correctAnswer: 'A',
    explanation: 'Keanekaragaman gen terjadi pada individu dalam satu spesies (Felis catus), yang ditunjukkan oleh variasi susunan alel seperti warna bulu, corak, atau panjang ekor.'
  },
  6: {
    id: 6,
    level: 12,
    topic: 'Wilayah Zoogeografi Dunia',
    question: 'Wilayah persebaran fauna yang mencakup Amerika Utara hingga bagian utara Meksiko disebut wilayah...',
    options: [
      { key: 'A', text: 'Neotropikal' },
      { key: 'B', text: 'Neartik' },
      { key: 'C', text: 'Paleartik' },
      { key: 'D', text: 'Ethiopian' },
      { key: 'E', text: 'Oriental' }
    ],
    correctAnswer: 'B',
    explanation: 'Wilayah Neartik mencakup Greenland dan Amerika Utara hingga Meksiko tengah. Fauna khasnya meliputi bison, beruang grizzly, kalkun liar, dan domba gunung.'
  },
  7: {
    id: 7,
    level: 11,
    topic: 'Manfaat Ekologis Keanekaragaman Hayati',
    question: 'Hutan yang berfungsi sebagai daerah resapan air dan mencegah terjadinya banjir merupakan manfaat keanekaragaman hayati dari segi...',
    options: [
      { key: 'A', text: 'Ekonomi' },
      { key: 'B', text: 'Ekologi' },
      { key: 'C', text: 'Budaya' },
      { key: 'D', text: 'Estetika' },
      { key: 'E', text: 'Rekreasi' }
    ],
    correctAnswer: 'B',
    explanation: 'Manfaat ekologi berkaitan dengan fungsi penyangga kehidupan dan regulasi alam: tata air hidrologis, pencegahan erosi/banjir, penyerapan karbon, dan penghasil oksigen.'
  },
  8: {
    id: 8,
    level: 11,
    topic: 'Manfaat Ekonomi Keanekaragaman Hayati',
    question: 'Pemanfaatan kayu jati dan kayu meranti sebagai bahan baku bangunan dan mebel menunjukkan manfaat keanekaragaman hayati di bidang...',
    options: [
      { key: 'A', text: 'Ekonomi' },
      { key: 'B', text: 'Ekologi' },
      { key: 'C', text: 'Estetika' },
      { key: 'D', text: 'Pendidikan' },
      { key: 'E', text: 'Sosial budaya' }
    ],
    correctAnswer: 'A',
    explanation: 'Pemanfaatan sumber daya hayati yang menghasilkan komoditas bernilai jual dan menopang industri furnitur/konstruksi merupakan manfaat di bidang ekonomi.'
  },
  9: {
    id: 9,
    level: 10,
    topic: 'Garis Wallace & Biogeografi',
    question: 'Alfred Russel Wallace menetapkan garis pemisah fauna Indonesia bagian barat dan tengah berdasarkan pengamatannya terhadap...',
    options: [
      { key: 'A', text: 'Perbedaan iklim yang mencolok antarwilayah' },
      { key: 'B', text: 'Perbedaan jenis fauna yang mencolok meski jarak antarwilayah berdekatan, misalnya antara Bali dan Lombok' },
      { key: 'C', text: 'Perbedaan jumlah penduduk di setiap pulau' },
      { key: 'D', text: 'Persamaan flora di seluruh wilayah Indonesia' },
      { key: 'E', text: 'Persebaran gunung berapi di Indonesia' }
    ],
    correctAnswer: 'B',
    explanation: 'Wallace mengamati bahwa Selat Lombok yang sempit menjadi pemisah tajam antara fauna berkarakter Oriental (Bali) dan fauna peralihan/Australasia (Lombok).'
  },
  10: {
    id: 10,
    level: 13,
    topic: 'Keanekaragaman Tingkat Ekosistem',
    question: 'Keanekaragaman tingkat ekosistem terjadi karena adanya interaksi antara...',
    options: [
      { key: 'A', text: 'Gen dan kromosom' },
      { key: 'B', text: 'Komponen biotik dan abiotik' },
      { key: 'C', text: 'Spesies sejenis' },
      { key: 'D', text: 'DNA dan RNA' },
      { key: 'E', text: 'Individu jantan dan betina' }
    ],
    correctAnswer: 'B',
    explanation: 'Ekosistem terbentuk oleh interaksi timbal balik antara komunitas makhluk hidup (komponen biotik) dengan lingkungan fisiknya (komponen abiotik seperti air, tanah, iklim, cahaya).'
  },
  11: {
    id: 11,
    level: 12,
    topic: 'Ancaman Keanekaragaman Hayati',
    question: 'Perburuan liar terhadap badak bercula satu secara terus-menerus dapat menyebabkan...',
    options: [
      { key: 'A', text: 'Peningkatan populasi' },
      { key: 'B', text: 'Kepunahan spesies' },
      { key: 'C', text: 'Perubahan iklim global' },
      { key: 'D', text: 'Peningkatan keanekaragaman gen' },
      { key: 'E', text: 'Perluasan habitat' }
    ],
    correctAnswer: 'B',
    explanation: 'Badak bercula satu (Rhinoceros sondaicus) memiliki laju reproduksi rendah. Perburuan liar yang melebihi daya dukung regenerasi menyebabkan penurunan drastis hingga kepunahan spesies.'
  },
  12: {
    id: 12,
    level: 10,
    topic: 'Bioma Indonesia Barat',
    question: 'Curah hujan tinggi sepanjang tahun serta suhu udara yang hangat menyebabkan Indonesia bagian barat memiliki bioma...',
    options: [
      { key: 'A', text: 'Sabana tropis' },
      { key: 'B', text: 'Hutan hujan tropis' },
      { key: 'C', text: 'Padang rumput stepa' },
      { key: 'D', text: 'Hutan gugur' },
      { key: 'E', text: 'Tundra' }
    ],
    correctAnswer: 'B',
    explanation: 'Kombinasi suhu hangat (25–28°C) dan presipitasi tinggi (>2000 mm/tahun) di kawasan Paparan Sunda membentuk bioma hutan hujan tropis dengan kanopi lebat dan biodiversitas tertinggi.'
  },
  13: {
    id: 13,
    level: 11,
    topic: 'Garis Weber & Biogeografi',
    question: 'Garis yang memisahkan wilayah fauna peralihan dan fauna Australis disebut garis...',
    options: [
      { key: 'A', text: 'Wallace' },
      { key: 'B', text: 'Weber' },
      { key: 'C', text: 'Lydekker' },
      { key: 'D', text: 'Meridian' },
      { key: 'E', text: 'Equator' }
    ],
    correctAnswer: 'B',
    explanation: 'Garis Weber adalah garis khayal yang membagi wilayah peralihan (Sulawesi, Nusa Tenggara) dengan wilayah fauna bercorak murni Australis (Papua & Maluku Timur).'
  },
  14: {
    id: 14,
    level: 9,
    topic: 'Faktor Biodiversitas Indonesia',
    question: 'Keanekaragaman hayati tingkat ekosistem di Indonesia sangat tinggi karena Indonesia terletak pada posisi geografis yang menyebabkan...',
    options: [
      { key: 'A', text: 'Hanya memiliki satu jenis iklim' },
      { key: 'B', text: 'Merupakan negara kepulauan yang dilalui garis khatulistiwa dengan variasi topografi tinggi' },
      { key: 'C', text: 'Tidak memiliki gunung berapi' },
      { key: 'D', text: 'Berada di kutub utara' },
      { key: 'E', text: 'Curah hujan yang seragam di semua wilayah' }
    ],
    correctAnswer: 'B',
    explanation: 'Posisi khatulistiwa, topografi bergunung-gunung, luasnya perairan kepulauan, serta pertemuan lempeng menciptakan bentang alam mikro-klimat beragam: pantai, mangrove, rawa gambut, hingga hutan pegunungan.'
  },
  15: {
    id: 15,
    level: 9,
    topic: 'Manfaat Sains & Bioteknologi',
    question: 'Manfaat keanekaragaman hayati dalam bidang ilmu pengetahuan ditunjukkan oleh...',
    options: [
      { key: 'A', text: 'Penelitian spesies baru untuk pengembangan bioteknologi' },
      { key: 'B', text: 'Penjualan kayu ke luar negeri' },
      { key: 'C', text: 'Pembukaan lahan untuk perumahan' },
      { key: 'D', text: 'Perburuan hewan liar' },
      { key: 'E', text: 'Konversi hutan menjadi perkebunan sawit' }
    ],
    correctAnswer: 'A',
    explanation: 'Kekayaan genetik dan kimiawi organisme menjadi bahan dasar penelitian ilmiah, rekayasa genetika, bio-prospeksi obat, dan riset bioteknologi masa depan.'
  },
  16: {
    id: 16,
    level: 10,
    topic: 'Manfaat Farmasi & Kesehatan',
    question: 'Pemanfaatan tumbuhan sebagai bahan baku obat-obatan tradisional menunjukkan manfaat keanekaragaman hayati di bidang...',
    options: [
      { key: 'A', text: 'Farmasi/kesehatan' },
      { key: 'B', text: 'Pertanian' },
      { key: 'C', text: 'Pariwisata' },
      { key: 'D', text: 'Industri tekstil' },
      { key: 'E', text: 'Perikanan' }
    ],
    correctAnswer: 'A',
    explanation: 'Kandungan metabolit sekunder (seperti kurkumin pada temulawak atau kina pada Cinchona) digunakan sebagai bahan obat herbal dan sintesis farmasi.'
  },
  17: {
    id: 17,
    level: 8,
    topic: 'Wilayah Zoogeografi Australis',
    question: 'Wilayah zoogeografi Australis menurut pembagian Wallace meliputi kawasan...',
    options: [
      { key: 'A', text: 'Amerika Selatan dan Amerika Tengah' },
      { key: 'B', text: 'Afrika bagian selatan Sahara' },
      { key: 'C', text: 'Australia, Selandia Baru, Papua, dan pulau-pulau sekitarnya' },
      { key: 'D', text: 'Asia Selatan dan Asia Tenggara' },
      { key: 'E', text: 'Eropa dan Asia Utara' }
    ],
    correctAnswer: 'C',
    explanation: 'Zona zoogeografi Australis membentang dari benua Australia, Selandia Baru, Papua Nugini, Papua (Indonesia), hingga pulau-pulau di Samudra Pasifik.'
  },
  18: {
    id: 18,
    level: 9,
    topic: 'Persebaran Fauna Australis di Indonesia',
    question: 'Fauna tipe Australis di Indonesia banyak ditemukan di wilayah...',
    options: [
      { key: 'A', text: 'Sumatra' },
      { key: 'B', text: 'Jawa' },
      { key: 'C', text: 'Kalimantan' },
      { key: 'D', text: 'Papua' },
      { key: 'E', text: 'Sulawesi' }
    ],
    correctAnswer: 'D',
    explanation: 'Wilayah Papua dan Kepulauan Aru terletak di Paparan Sahul, sehingga faunanya sangat dekat dengan Australia (marsupialia, kakatua raja, kasuari, cendrawasih).'
  },
  19: {
    id: 19,
    level: 8,
    topic: 'Spesies Invasif & Ancaman Ekosistem',
    question: 'Introduksi spesies asing (invasive species) ke suatu ekosistem dapat mengancam keanekaragaman hayati lokal karena...',
    options: [
      { key: 'A', text: 'Spesies asing selalu punah dengan cepat' },
      { key: 'B', text: 'Spesies asing dapat mendominasi dan menggeser spesies lokal' },
      { key: 'C', text: 'Tidak berpengaruh pada rantai makanan' },
      { key: 'D', text: 'Meningkatkan populasi spesies asli' },
      { key: 'E', text: 'Mempercepat suksesi ekosistem menuju klimaks' }
    ],
    correctAnswer: 'B',
    explanation: 'Spesies invasif seringkali tidak memiliki predator alami di habitat baru, sehingga berkembang sangat cepat, merebut relung ekologi, dan memangsa/menggeser spesies asli.'
  },
  20: {
    id: 20,
    level: 7,
    topic: 'Genetika Populasi & Variasi Gen',
    question: 'Perkawinan secara acak (random mating) dalam suatu populasi dapat meningkatkan keanekaragaman hayati tingkat gen karena...',
    options: [
      { key: 'A', text: 'Menghasilkan kombinasi alel baru pada keturunan' },
      { key: 'B', text: 'Menghilangkan variasi genetik yang sudah ada' },
      { key: 'C', text: 'Menyamakan seluruh sifat individu dalam populasi' },
      { key: 'D', text: 'Mengubah jumlah spesies dalam ekosistem' },
      { key: 'E', text: 'Tidak berpengaruh terhadap pewarisan sifat' }
    ],
    correctAnswer: 'A',
    explanation: 'Perkawinan acak memungkinkan rekombinasi genetik secara maksimal saat meiosis dan fertilisasi, menghasilkan kombinasi susunan alel baru pada keturunan.'
  },
  21: {
    id: 21,
    level: 8,
    topic: 'Ancaman Antropogenik',
    question: 'Berikut ini yang termasuk ancaman terhadap keanekaragaman hayati akibat aktivitas manusia adalah...',
    options: [
      { key: 'A', text: 'Gempa bumi' },
      { key: 'B', text: 'Deforestasi dan alih fungsi lahan' },
      { key: 'C', text: 'Rotasi bumi' },
      { key: 'D', text: 'Fotosintesis' },
      { key: 'E', text: 'Siklus air' }
    ],
    correctAnswer: 'B',
    explanation: 'Deforestasi, fragmentasi habitat, dan pembukaan hutan untuk perkebunan/tambang merupakan ancaman utama kepunahan spesies yang disebabkan langsung oleh aktivitas manusia.'
  },
  22: {
    id: 22,
    level: 7,
    topic: 'Ekowisata & Manfaat Kehati',
    question: 'Keberadaan taman nasional yang dijadikan objek wisata alam menunjukkan manfaat keanekaragaman hayati sebagai...',
    options: [
      { key: 'A', text: 'Sumber plasma nutfah semata' },
      { key: 'B', text: 'Sumber devisa melalui ekowisata' },
      { key: 'C', text: 'Pengatur iklim semata' },
      { key: 'D', text: 'Penyerap karbon semata' },
      { key: 'E', text: 'Habitat alami tanpa nilai ekonomi' }
    ],
    correctAnswer: 'B',
    explanation: 'Pariwisata berbasis alam (ekowisata) di Taman Nasional seperti Komodo, Bunaken, atau Bromo menghasilkan pendapatan ekonomi dan devisa negara tanpa merusak keanekaragaman hayati.'
  },
  23: {
    id: 23,
    level: 7,
    topic: 'Ciri Fauna Australis',
    question: 'Ciri khas fauna Australis antara lain...',
    options: [
      { key: 'A', text: 'Terdapat banyak jenis kera' },
      { key: 'B', text: 'Terdapat hewan berkantung dan burung berwarna cerah seperti cendrawasih' },
      { key: 'C', text: 'Terdapat harimau dan macan tutul' },
      { key: 'D', text: 'Tidak memiliki burung' },
      { key: 'E', text: 'Didominasi hewan bertubuh besar seperti gajah' }
    ],
    correctAnswer: 'B',
    explanation: 'Fauna Australis didominasi mamalia berkantung (marsupialia seperti kuskus dan kanguru pohon), tidak ada kera arboreal besar, serta memiliki avifauna berbulu indah mencolok.'
  },
  24: {
    id: 24,
    level: 6,
    topic: 'Keanekaragaman Genetik',
    question: 'Perbedaan bentuk telinga, warna bulu, dan ukuran tubuh pada berbagai ras anjing seperti Chihuahua, Poodle, dan Bulldog merupakan contoh keanekaragaman hayati tingkat...',
    options: [
      { key: 'A', text: 'Ekosistem' },
      { key: 'B', text: 'Gen' },
      { key: 'C', text: 'Jenis' },
      { key: 'D', text: 'Populasi' },
      { key: 'E', text: 'Komunitas' }
    ],
    correctAnswer: 'B',
    explanation: 'Semua anjing ras tergolong dalam spesies yang sama yaitu Canis lupus familiaris. Variasi fisik antar-ras terjadi akibat perbedaan susunan genetik (variasi tingkat gen).'
  },
  25: {
    id: 25,
    level: 6,
    topic: 'Ekosistem Terumbu Karang',
    question: 'Tingginya keanekaragaman hayati pada ekosistem terumbu karang berperan penting bagi kehidupan laut karena berfungsi sebagai...',
    options: [
      { key: 'A', text: 'Tempat memijah, mencari makan, dan berlindung bagi berbagai biota laut' },
      { key: 'B', text: 'Sumber utama air tawar bagi makhluk hidup' },
      { key: 'C', text: 'Penghasil oksigen satu-satunya di bumi' },
      { key: 'D', text: 'Tempat penampungan sampah plastik' },
      { key: 'E', text: 'Pengatur suhu daratan di sekitar pantai' }
    ],
    correctAnswer: 'A',
    explanation: 'Terumbu karang dijuluki "rainforest of the sea" karena menyediakan nursery ground (pemijahan), feeding ground (mencari makan), dan shelter (perlindungan) bagi 25% biota laut.'
  },
  26: {
    id: 26,
    level: 6,
    topic: 'Keanekaragaman Hayati Tingkat Jenis',
    question: 'Contoh keanekaragaman hayati tingkat jenis (spesies) ditunjukkan oleh kelompok...',
    options: [
      { key: 'A', text: 'Kelapa, pinang, dan aren' },
      { key: 'B', text: 'Padi IR64, Ciherang, dan Rojolele' },
      { key: 'C', text: 'Ayam kampung, ayam broiler, dan ayam bangkok' },
      { key: 'D', text: 'Bunga mawar merah, putih, dan kuning' },
      { key: 'E', text: 'Ikan mas koki dengan berbagai warna' }
    ],
    correctAnswer: 'A',
    explanation: 'Kelapa (Cocos nucifera), pinang (Areca catechu), dan aren (Arenga pinnata) adalah spesies berbeda yang berada dalam satu famili Arecaceae (Palmae), contoh tingkat jenis.'
  },
  27: {
    id: 27,
    level: 5,
    topic: 'Kategori Status Konservasi IUCN',
    question: 'Status konservasi suatu spesies yang populasinya sudah tidak ditemukan lagi di alam liar, tetapi masih bertahan hidup di penangkaran atau budi daya, menurut IUCN Red List disebut...',
    options: [
      { key: 'A', text: 'Critically Endangered (CR)' },
      { key: 'B', text: 'Extinct in the Wild (EW)' },
      { key: 'C', text: 'Vulnerable (VU)' },
      { key: 'D', text: 'Near Threatened (NT)' },
      { key: 'E', text: 'Least Concern (LC)' }
    ],
    correctAnswer: 'B',
    explanation: 'Extinct in the Wild (EW) adalah kategori bagi takson yang hanya diketahui hidup dalam budi daya, penangkaran, atau sebagai populasi naturalisasi di luar habitat masa lalu.'
  },
  28: {
    id: 28,
    level: 5,
    topic: 'Konsep Tingkat Keanekaragaman',
    question: 'Perhatikan pernyataan berikut: (1) Padi, jagung, dan gandum; (2) Mangga manalagi, mangga gadung, dan mangga harum manis. Pernyataan (1) menunjukkan keanekaragaman tingkat ... dan (2) menunjukkan tingkat ...',
    options: [
      { key: 'A', text: 'Ekosistem – gen' },
      { key: 'B', text: 'Jenis – gen' },
      { key: 'C', text: 'Gen – jenis' },
      { key: 'D', text: 'Jenis – ekosistem' },
      { key: 'E', text: 'Gen – ekosistem' }
    ],
    correctAnswer: 'B',
    explanation: '(1) Padi, jagung, gandum merupakan spesies berbeda dalam famili Poaceae (tingkat jenis). (2) Berbagai varietas mangga adalah variasi dalam satu spesies Mangifera indica (tingkat gen).'
  },
  29: {
    id: 29,
    level: 5,
    topic: 'Kawasan Fauna Peralihan (Wallacea)',
    question: 'Wilayah fauna peralihan (tipe Wallacea) di Indonesia meliputi...',
    options: [
      { key: 'A', text: 'Sumatra, Jawa, dan Kalimantan' },
      { key: 'B', text: 'Papua dan Maluku' },
      { key: 'C', text: 'Sulawesi, Nusa Tenggara, dan Maluku' },
      { key: 'D', text: 'Sumatra dan Papua' },
      { key: 'E', text: 'Jawa dan Bali' }
    ],
    correctAnswer: 'C',
    explanation: 'Wilayah Kepulauan Wallacea terletak di antara Garis Wallace dan Garis Weber/Lydekker, meliputi pulau Sulawesi, Nusa Tenggara Barat, Nusa Tenggara Timur, dan Kepulauan Maluku.'
  },
  30: {
    id: 30,
    level: 4,
    topic: 'Variasi Alel Tingkat Gen',
    question: 'Dalam suatu populasi kucing ditemukan variasi warna bulu hitam, putih, dan belang. Fenomena ini terjadi akibat...',
    options: [
      { key: 'A', text: 'Perbedaan spesies dalam famili Felidae' },
      { key: 'B', text: 'Ekspresi gen yang berbeda dari alel-alel yang diwariskan induk' },
      { key: 'C', text: 'Perbedaan ekosistem tempat hidup' },
      { key: 'D', text: 'Faktor abiotik seperti suhu' },
      { key: 'E', text: 'Perbedaan tingkat trofik' }
    ],
    correctAnswer: 'B',
    explanation: 'Variasi fenotipe warna bulu pada spesies yang sama dikendalikan oleh ekspresi susunan alel genetik yang berbeda yang diwariskan dari kedua induk.'
  },
  31: {
    id: 31,
    level: 4,
    topic: 'Fauna Endemik Wallacea',
    question: 'Contoh fauna khas wilayah Wallacea (peralihan) adalah...',
    options: [
      { key: 'A', text: 'Orang utan' },
      { key: 'B', text: 'Komodo dan anoa' },
      { key: 'C', text: 'Gajah' },
      { key: 'D', text: 'Kanguru' },
      { key: 'E', text: 'Cendrawasih' }
    ],
    correctAnswer: 'B',
    explanation: 'Komodo (Pulau Komodo/NTT), Anoa, Babirusa, dan Maleo (Sulawesi) adalah hewan endemik murni wilayah peralihan Wallacea yang tidak dijumpai di Asiatis maupun Australis.'
  },
  32: {
    id: 32,
    level: 4,
    topic: 'Karakteristik Komponen Ekosistem',
    question: 'Ekosistem sawah, ekosistem hutan hujan tropis, dan ekosistem terumbu karang berbeda satu sama lain terutama karena perbedaan...',
    options: [
      { key: 'A', text: 'Jumlah gen dalam populasi' },
      { key: 'B', text: 'Kondisi iklim, tanah, dan komponen abiotik lainnya' },
      { key: 'C', text: 'Warna organisme penyusunnya' },
      { key: 'D', text: 'Jenis reproduksi organisme' },
      { key: 'E', text: 'Ukuran wilayah geografis' }
    ],
    correctAnswer: 'B',
    explanation: 'Setiap ekosistem memiliki ciri khas parameter abiotik (suhu, curah hujan, salinitas, tipe substrat tanah) yang menentukan jenis-jenis komunitas organisme (biotik) yang mampu hidup di dalamnya.'
  },
  33: {
    id: 33,
    level: 3,
    topic: 'Ciri Khas Fauna Asiatis (Oriental)',
    question: 'Fauna Indonesia bagian barat (Asiatis) memiliki ciri khas antara lain...',
    options: [
      { key: 'A', text: 'Terdapat banyak hewan berkantung' },
      { key: 'B', text: 'Terdapat mamalia besar seperti gajah, badak bercula satu, dan harimau' },
      { key: 'C', text: 'Terdapat burung cendrawasih' },
      { key: 'D', text: 'Terdapat kanguru pohon' },
      { key: 'E', text: 'Tidak memiliki mamalia' }
    ],
    correctAnswer: 'B',
    explanation: 'Fauna kawasan Asiatis (Paparan Sunda: Sumatra, Jawa, Kalimantan) dicirikan oleh mamalia plasental berukuran besar seperti Gajah Sumatra, Badak Bercula Satu (Jawa), Harimau, dan Primata seperti Orang Utan.'
  },
  34: {
    id: 34,
    level: 3,
    topic: 'Peran Ekologis Rantai Makanan',
    question: 'Keanekaragaman hayati berperan penting dalam menjaga keseimbangan rantai makanan karena...',
    options: [
      { key: 'A', text: 'Setiap organisme memiliki peran tersendiri dalam ekosistem' },
      { key: 'B', text: 'Semua organisme memiliki peran yang sama' },
      { key: 'C', text: 'Hanya predator yang penting dalam ekosistem' },
      { key: 'D', text: 'Produsen tidak berpengaruh pada ekosistem' },
      { key: 'E', text: 'Rantai makanan tidak bergantung pada keanekaragaman spesies' }
    ],
    correctAnswer: 'A',
    explanation: 'Tiap organisme menempati relung (niche) spesifik sebagai produsen, konsumen tingkat I, II, III, detritivor, atau dekomposer. Kehilangan satu spesies dapat mengganggu kestabilan jaring-jaring makanan.'
  },
  35: {
    id: 35,
    level: 3,
    topic: 'Wilayah Zoogeografi Paleartik',
    question: 'Wilayah zoogeografi yang meliputi Eropa, Asia bagian utara, dan Afrika bagian utara (Gurun Sahara ke utara) disebut wilayah...',
    options: [
      { key: 'A', text: 'Neotropikal' },
      { key: 'B', text: 'Neartik' },
      { key: 'C', text: 'Paleartik' },
      { key: 'D', text: 'Oriental' },
      { key: 'E', text: 'Ethiopian' }
    ],
    correctAnswer: 'C',
    explanation: 'Zona Paleartik mencakup hampir seluruh daratan benua Eurasia (Eropa dan Rusia/Asia utara) serta sabuk Afrika utara di atas Gurun Sahara.'
  },
  36: {
    id: 36,
    level: 2,
    topic: 'Garis Wallace (Asiatis - Peralihan)',
    question: 'Garis yang memisahkan wilayah fauna Asiatis dan fauna peralihan di Indonesia disebut garis...',
    options: [
      { key: 'A', text: 'Wallace' },
      { key: 'B', text: 'Weber' },
      { key: 'C', text: 'Khatulistiwa' },
      { key: 'D', text: 'Bujur' },
      { key: 'E', text: 'Lintang' }
    ],
    correctAnswer: 'A',
    explanation: 'Garis Wallace ditarik melewati Selat Makassar (antara Kalimantan dan Sulawesi) lalu berlanjut ke Selat Lombok (antara Bali dan Lombok).'
  },
  37: {
    id: 37,
    level: 1,
    topic: 'Tingkatan Keanekaragaman Hayati',
    question: 'Tiga tingkatan keanekaragaman hayati yang dikenal dalam ilmu biologi adalah...',
    options: [
      { key: 'A', text: 'Gen, jenis, dan ekosistem' },
      { key: 'B', text: 'Populasi, komunitas, dan bioma' },
      { key: 'C', text: 'Individu, populasi, dan komunitas' },
      { key: 'D', text: 'Sel, jaringan, dan organ' },
      { key: 'E', text: 'Produsen, konsumen, dan pengurai' }
    ],
    correctAnswer: 'A',
    explanation: 'Keanekaragaman hayati (biodiversitas) secara ilmiah diklasifikasikan ke dalam 3 tingkatan hierarkis: tingkat gen (variasi alel), tingkat jenis/spesies, dan tingkat ekosistem.'
  },
  38: {
    id: 38,
    level: 2,
    topic: 'Pelestarian In-Situ',
    question: 'Upaya pelestarian keanekaragaman hayati yang dilakukan di dalam habitat aslinya disebut pelestarian...',
    options: [
      { key: 'A', text: 'In-situ, contohnya taman nasional dan suaka margasatwa' },
      { key: 'B', text: 'Ex-situ, contohnya kebun binatang' },
      { key: 'C', text: 'Buatan' },
      { key: 'D', text: 'Sementara' },
      { key: 'E', text: 'Domestikasi' }
    ],
    correctAnswer: 'A',
    explanation: 'Pelestarian in-situ adalah perlindungan flora/fauna langsung di habitat aslinya tanpa memindahkan individu, seperti di Taman Nasional, Suaka Margasatwa, dan Cagar Alam.'
  },
  39: {
    id: 39,
    level: 2,
    topic: 'Bank Gen & Konservasi Plasma Nutfah',
    question: 'Pembangunan bank gen (gene bank) bertujuan utama untuk...',
    options: [
      { key: 'A', text: 'Menyimpan dan melestarikan materi genetik berbagai spesies untuk kepentingan masa depan' },
      { key: 'B', text: 'Meningkatkan hasil penjualan produk pertanian' },
      { key: 'C', text: 'Mengurangi jumlah spesies liar di alam' },
      { key: 'D', text: 'Mempercepat proses kepunahan alami' },
      { key: 'E', text: 'Menggantikan fungsi taman nasional' }
    ],
    correctAnswer: 'A',
    explanation: 'Bank gen menyimpan benih, serbuk sari, spora, atau materi kriogenik DNA/jaringan untuk mencegah hilangnya variabilitas plasma nutfah akibat ancaman kepunahan.'
  },
  40: {
    id: 40,
    level: 2,
    topic: 'Flora Karakteristik Australis',
    question: 'Flora khas yang banyak dijumpai di wilayah Indonesia timur, seperti Papua, memiliki kemiripan dengan flora benua Australia, misalnya...',
    options: [
      { key: 'A', text: 'Meranti dan kayu ulin' },
      { key: 'B', text: 'Matoa dan berbagai jenis Eucalyptus' },
      { key: 'C', text: 'Cendana dan kayu manis' },
      { key: 'D', text: 'Bakau dan nipah' },
      { key: 'E', text: 'Anggrek bulan dan kantong semar' }
    ],
    correctAnswer: 'B',
    explanation: 'Wilayah Papua (Paparan Sahul) memiliki kemiripan flora dengan Australia yang ditandai pohon Eucalyptus, matoa (Pometia pinnata), dan pohon ara khas kawasan Australis.'
  },
  41: {
    id: 41,
    level: 2,
    topic: 'Keanekaragaman Hayati Tingkat Gen',
    imageType: 'cat_variety',
    imageUrl: 'https://stylesatlife.com/wp-content/uploads/2021/02/cat-species.jpg',
    imageCaption: 'Variasi fenotipe warna bulu, ketebalan bulu, dan bentuk wajah pada kucing (Felis catus)',
    question: 'Perhatikan variasi beberapa jenis kucing pada gambar di atas! Perbedaan fenotipe seperti corak warna bulu, ketebalan rambut, dan bentuk wajah pada kucing-kucing tersebut menunjukkan keanekaragaman hayati tingkat...',
    options: [
      { key: 'A', text: 'Gen, karena terjadi pada spesies yang sama (Felis catus) akibat kombinasi susunan alel yang berbeda' },
      { key: 'B', text: 'Jenis/Spesies, karena kucing-kucing tersebut memiliki nama ilmiah yang berbeda' },
      { key: 'C', text: 'Ekosistem, karena hidup pada habitat dan iklim pemeliharaan yang berbeda' },
      { key: 'D', text: 'Filogenik, karena berasal dari garis keturunan ordo karnivora yang terpisah' },
      { key: 'E', text: 'Populasi, karena menunjukkan penyebaran kelompok individu di habitat aslinya' }
    ],
    correctAnswer: 'A',
    explanation: 'Variasi antarindividu dalam satu spesies (Felis catus) merupakan contoh keanekaragaman hayati tingkat gen.'
  },
  42: {
    id: 42,
    level: 3,
    topic: 'Keanekaragaman Hayati Tingkat Jenis',
    imageType: 'panthera_species',
    imageUrl: 'https://gbaike-image.cdn.bcebos.com/a50f4bfbfbedab64034f7b4d2f61b8c379310b55b0bd/a50f4bfbfbedab64034f7b4d2f61b8c379310b55b0bd_16_9?x-bce-process=image/format,f_auto',
    imageCaption: 'Perbandingan tiga spesies karnivora dalam genus Panthera (famili Felidae)',
    question: 'Perhatikan ketiga hewan karnivora pada gambar di atas! Harimau (Panthera tigris), Singa (Panthera leo), dan Macan Tutul (Panthera pardus) dikelompokkan ke dalam keanekaragaman tingkat jenis/spesies karena...',
    options: [
      { key: 'A', text: 'Berada dalam genus yang sama (Panthera) namun merupakan spesies berbeda dengan ciri morfologi dan fisiologi khas serta tidak menghasilkan keturunan fertil jika disilangkan' },
      { key: 'B', text: 'Memiliki susunan kromosom yang 100% identik namun dipengaruhi oleh lingkungan tempat tinggalnya' },
      { key: 'C', text: 'Merupakan satu populasi yang sama yang mengalami isolasi geografis di berbagai benua' },
      { key: 'D', text: 'Merupakan keanekaragaman tingkat gen akibat mutasi buatan manusia' },
      { key: 'E', text: 'Menunjukkan keanekaragaman ekosistem savana dan hutan tropis' }
    ],
    correctAnswer: 'A',
    explanation: 'Harimau, singa, dan macan tutul adalah spesies berbeda dalam satu genus (Panthera), sehingga tergolong keanekaragaman tingkat jenis (spesies).'
  },
  43: {
    id: 43,
    level: 6,
    topic: 'Biogeografi Indonesia & Garis Weber',
    imageType: 'biogeography_map',
    imageUrl: 'https://img-core.ruangguru.com/question/Eildzot6255/3600af9328843b48819c69509bf1e9fbf49e139c351c365aef67d62227c950f2.png?w=300&h=168',
    imageCaption: 'Peta garis biogeografi kepulauan Indonesia (Garis Wallace & Garis Weber)',
    question: 'Perhatikan peta biogeografi Indonesia di atas! Garis imajiner yang ditunjuk oleh angka 2 serta fungsinya dalam biogeografi adalah...',
    options: [
      { key: 'A', text: 'Garis Weber, yaitu garis batas yang memisahkan wilayah fauna peralihan dengan fauna tipe Australis (Papua dan sekitarnya)' },
      { key: 'B', text: 'Garis Wallace, yaitu garis batas yang memisahkan wilayah fauna tipe Asiatis dengan fauna tipe Peralihan' },
      { key: 'C', text: 'Garis Lydekker, yaitu garis batas paparan kontinen dangkalan Sahul di perbatasan Australia' },
      { key: 'D', text: 'Garis Khatulistiwa, yaitu garis lintang nol derajat yang membedakan iklim tropis basah dan kering' },
      { key: 'E', text: 'Garis Isobar, yaitu garis batas kesamaan tekanan udara dan curah hujan di kepulauan Maluku' }
    ],
    correctAnswer: 'A',
    explanation: 'Garis Wallace memisahkan Zona Oriental (Asiatis) dengan Zona Peralihan (Wallacea). Garis Weber (angka 2) memisahkan Zona Peralihan dengan Zona Australis (Papua & Maluku).'
  },
  44: {
    id: 44,
    level: 12,
    topic: 'Ancaman Fragmentasi Habitat',
    imageType: 'forest_road_fragmentation',
    imageUrl: 'https://indomgb.s3.amazonaws.com/wp-content/uploads/2018/11/22070835/Jalan-Tambang-Emas-PT-EMM.jpg',
    imageCaption: 'Pembangunan jalan yang membelah ekosistem kawasan hutan alam',
    question: 'Perhatikan foto pembangunan jalan raya yang membelah kawasan hutan alam pada gambar di atas! Aktivitas pembukaan lahan hutan untuk pembangunan jalan lintas (fragmentasi habitat) memberikan ancaman serius terhadap kelestarian keanekaragaman hayati karena...',
    options: [
      { key: 'A', text: 'Memutus koridor pergerakan satwa (edge effect), mempersempit ruang jelajah alami, dan meningkatkan risiko satwa tertabrak serta perburuan liar' },
      { key: 'B', text: 'Mempercepat proses adaptasi satwa liar menjadi satwa domestik yang ramah terhadap manusia' },
      { key: 'C', text: 'Menambah daya dukung ekosistem hutan karena mempermudah aliran air hujan di tepi jalan' },
      { key: 'D', text: 'Meningkatkan keanekaragaman hayati tanaman pangan di sepanjang sisi pembukaan jalan' },
      { key: 'E', text: 'Mencegah terjadinya bencana kebakaran hutan secara alami antarpetak hutan' }
    ],
    correctAnswer: 'A',
    explanation: 'Pembukaan jalan raya di dalam hutan menyebabkan fragmentasi habitat (hutan terbelah menjadi petak-petak kecil yang terisolasi), memutus jalur migrasi/jelajah satwa liar, memicu kematian akibat tertabrak kendaraan (roadkill), efek tepi (edge effect), dan memudahkan akses perburuan liar.'
  },
  45: {
    id: 45,
    level: 15,
    topic: 'Pelestarian In-Situ vs Ex-Situ',
    imageType: 'insitu_exsitu_conservation',
    images: [
      {
        label: 'Gambar 1: Taman Nasional Komodo',
        url: 'https://pelatihanpariwisata.com/wp-content/uploads/2023/08/jalan-panjang-wisata-alam-taman-nasional-komodo.jpg',
        caption: 'Gambar 1: Kawasan Konservasi In-Situ (Habitat Asli Komodo)'
      },
      {
        label: 'Gambar 2: Kebun Raya Bogor',
        url: 'https://static.promediateknologi.id/crop/0x0:0x0/750x500/webp/photo/p2/202/2024/12/11/Kebun-Raya-Bogor-Apri-ApingJPG-1117954810.jpg',
        caption: 'Gambar 2: Kawasan Konservasi Ex-Situ (Koleksi & Pelestarian Tumbuhan)'
      }
    ],
    imageCaption: 'Perbandingan program konservasi In-Situ (Taman Nasional) dan Ex-Situ (Kebun Raya / Taman Safari)',
    question: 'Perhatikan kedua program pelestarian keanekaragaman hayati pada gambar di atas! Perbedaan mendasar antara upaya konservasi In-Situ (seperti pada Gambar 1: Taman Nasional) dengan konservasi Ex-Situ (seperti pada Gambar 2: Taman Safari / Kebun Raya) adalah...',
    options: [
      { key: 'A', text: 'Konservasi In-Situ dilakukan di dalam habitat aslinya untuk menjaga ekosistem secara utuh, sedangkan konservasi Ex-Situ dilakukan di luar habitat aslinya untuk pengembangbiakan, rehabilitasi, atau perlindungan' },
      { key: 'B', text: 'Konservasi In-Situ hanya untuk tumbuhan langka, sedangkan Ex-Situ khusus untuk mamalia besar' },
      { key: 'C', text: 'Konservasi In-Situ memindahkan satwa ke lingkungan buatan manusia, sedangkan Ex-Situ membiarkan satwa di alam bebas' },
      { key: 'D', text: 'Konservasi Ex-Situ bertujuan menghasilkan spesies mutan baru, sedangkan In-Situ untuk perdagangan satwa' },
      { key: 'E', text: 'Konservasi In-Situ bersifat sementara, sedangkan Ex-Situ wajib dilakukan seumur hidup satwa' }
    ],
    correctAnswer: 'A',
    explanation: 'Pelestarian In-situ dilakukan di dalam habitat asli (Taman Nasional, Suaka Margasatwa, Cagar Alam), sedangkan Ex-situ dilakukan di luar habitat asli (Taman Safari, Kebun Binatang, Kebun Raya).'
  }
};
