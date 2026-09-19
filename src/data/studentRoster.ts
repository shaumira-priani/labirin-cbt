// Daftar Roster Siswa Resmi per Kelas untuk Ulangan Harian Biologi
export interface ClassRoster {
  className: string;
  gradeLevel: '10' | '12';
  packageTitleId: string;
  packageTitleEn: string;
  students: string[];
}

export const CLASS_ROSTERS: Record<string, ClassRoster> = {
  '10 Khodijah': {
    className: '10 Khodijah',
    gradeLevel: '10',
    packageTitleId: 'Kelas 10 (Keanekaragaman Hayati)',
    packageTitleEn: 'Grade 10 (Biodiversity)',
    students: [
      'AINIYA FAIDA AZMI',
      'ALMAIRA HUSNA SHALIHAH',
      'ALYAA TAQIYAH PAHMI',
      'AMIRA KHAIRUNISA',
      'CEICILLIA KHOIRUNNISA PUTRI KHAYLA',
      'ERDIANI GHEFIRA NAOFAL',
      'FARAH FAUZIYYAH',
      'FATHIMAH AZZAHRA SALAHUDIN',
      'HASNA HANIFA ACHMADI',
      'KHANSA NAYLA RIFQAH',
      'KHAULAH SYIFAA MUJAHIDAH',
      'MAURA VANIA TRIPRAMESWARI',
      'MYIESHA SYAKIRA RINAWAN',
      'NAILA HASNA FAIRUZIA',
      'NAURA NURUL FADHILAH SUSANTO',
      'NAZLA SALSABILA ANANDA',
      'NYCTA ANNISA ZAHRA',
      'REGISTHA DEFTIANA',
      'SEIZA RIEHADATUL AISYA',
      'SHAFA AULIA ELNUR PUTRI',
      'SYAKIRA DANISY AQILAH',
      'SYASYA FAIQA RIDHA',
      'WAFA EL SYFA',
      'WAFA EN NAZHEEFA',
      'ZSAVANNAH FATHIRIL HAQ AHMAD'
    ]
  },
  '10 Fatimah': {
    className: '10 Fatimah',
    gradeLevel: '10',
    packageTitleId: 'Kelas 10 (Keanekaragaman Hayati)',
    packageTitleEn: 'Grade 10 (Biodiversity)',
    students: [
      'AISYAH RIFA AZZAHRA',
      'ANNISA AMELIA ZAHRA',
      'ASIAH MUTHMAINNAH LAYA',
      'ATHAYA NAIA ASTYAWANTO',
      'AULIA PUTRI SALSABILA',
      'AULIA SHAFIRA NUR AZIZAH',
      'CALLYSTA AISYAH MADA SURYA',
      'CURRENT ALYSIA HUMAIRA',
      'FATIMAH ASSYIFA HULWATUNNISA',
      'FATIMAH RAMDHANI ZAHRATUSSANIYYAH',
      'FAUZIYAH KHALISHAH',
      'FIRZANAH HANI AINIYAH WIYOTO',
      'HARUMI FATIMA SIAHAAN',
      'HIKARI FARHAH AISY',
      'JENI HAJAR NUR SYIFA',
      'JIHAN AQILAH RAMADIANI',
      'KHADIDJAH AULIA KHAIRUNISSA',
      'NADHILAH HUMAIRAH SYAHIDAH',
      'REGINA PUTRI IRNISA',
      'SALISA NOOR NADZIFA',
      'SHAKILA AYESHA HERAWATI',
      'SHAKIRA AZAHRA SUGIONO',
      'SHIRIN NAFISAH KHUMAIRANIA',
      'SYIFA FARIZAH ATHAYA',
      'SYIFA KHAIRANI',
      'ZIELQIS GUNSTBEWIJS ASHIRU'
    ]
  },
  '12 Saintek 4': {
    className: '12 Saintek 4',
    gradeLevel: '12',
    packageTitleId: 'Kelas 12 (Enzim & Metabolisme Sel)',
    packageTitleEn: 'Grade 12 (Enzymes & Cell Metabolism)',
    students: [
      'ALIFA AZKA QURROTA AYUN',
      'ALISYA FAUSTA',
      'ALMAGHFIRA NANDITA RASJID',
      'ALYA FILISTIN ISLAM',
      'ANEZKA ZHARIFAH MAHESWARI',
      'ARINA ALYA DAYANA',
      'ASHIKA SHIDDIQ',
      'DZAKIYYA NUR RAIHANA',
      'FATHEEYA RACHEEL RUSTIAN',
      'HANY SYAHIDA MULYADI',
      'KAUTSAR FAKHIRA',
      'KHANSA PUTRI SALSABILA',
      'MALIDA MAHESA AYU',
      'NASYWA AISYATUR RAHMAH',
      'NAYLA FAKHIRAH WULANDARI',
      'NISRINA MUTIARA SYAHIDAH',
      'NURUL AZIZAH',
      'PRIDEA AZKAAQILA ABDULLAH',
      'QONITA MAISUN DIYUSTARI',
      'RAIHANA AYUWIDARI FIRNADI',
      'SALMA HASIAN AZMI PANDJAITAN',
      'SALSABILA KHAIRUNNISA',
      'SHAFIYYAH ZAHIDAH NUR KHAIRUNNISA',
      'SILMI KHAIRUNNISA ARYO',
      'SYIFA MARITZA PUTRI SUJATMIKO'
    ]
  },
  '12 Saintek 5': {
    className: '12 Saintek 5',
    gradeLevel: '12',
    packageTitleId: 'Kelas 12 (Enzim & Metabolisme Sel)',
    packageTitleEn: 'Grade 12 (Enzymes & Cell Metabolism)',
    students: [
      'ALMA SHAISTA NAFISA',
      'AMANY KHAIRA ASSEGAF',
      'AMIRAH SYAHIMAH DIANSA',
      'ANNISA SAYYIDATUZ ZAHRA',
      'AZKA ELMIRA ISWANTO',
      'BALQIS JIHAN AZZAHRA',
      'BATRISYA FAUSTA PRIYANTO',
      'CAESYA CHAIRUNNISA',
      'FAKHIRA PUTRI ISNAWAN',
      'FIDELYA SHOFURA',
      'GHINA AISHA SUHAIMAH',
      'INAYA MUFIDA',
      'KALILAFADHIYA IZZATI MAGHFIRALIKA',
      'KHALILA MAJALYN',
      'KHANSA FADILA',
      'KHAYYIRA DESWAN KHAIRANI',
      'KIRANA ZASKIA ROXANDRIA',
      'NADYA BINTI UMAR SALEH NAHDI',
      'NASYWA PUTRI KARENSA',
      'NAZEEHA ADRIANA',
      'NAZHIRA AIDILA MIRSAL',
      'PUSPITA WALIDAH SALMAH',
      'QANITA ZHAFIRAH HIDAYAT',
      'RAYSA NURHANIFAH',
      'SYIFA NUR FADILA'
    ]
  },
  '12 Saintek 6': {
    className: '12 Saintek 6',
    gradeLevel: '12',
    packageTitleId: 'Kelas 12 (Enzim & Metabolisme Sel)',
    packageTitleEn: 'Grade 12 (Enzymes & Cell Metabolism)',
    students: [
      'ALIFKA FAYZA NUGROHO',
      'ALMIRA CHAIRUNNISA',
      'ALYA AZIZAH ZALFA HIDAYAT',
      'BALQIS IZZATI BINTARTHO',
      'BELLA CHAMILLAH JINGGA',
      'EDRIA MALVA MUMTAZAH RACHMAN',
      'FARIZYA AULIA RACHMA',
      'GHAIDA FATHINATUL HUSNA',
      'HELGA PRAMUDITA NARIMAN',
      'JIELAN ALTHAFUNNISA',
      'KIARA LINTANG WIDIANTOKO',
      'KUNI ZAYYANA ILMA',
      'MALIKAH ALIFRY REARDY',
      'NAIRA IZZA HANIFA HASIBUAN',
      'NAURA ZAHWA AQILA',
      'QUINEISHA SAMIRA PADMARINI',
      'QUINSHA KAYLA AMRU',
      'RANIA AQILA',
      'REVA ISMA MUFIDA RAMADANICA',
      'SALSABILA FAKHRIYATI',
      'SHAQILA SHABIRA',
      'VINA HALIFATUL KAMILA',
      'ZULFA DUHA FITRA'
    ]
  }
};

export const CLASS_LIST = [
  {
    label: '10 Khodijah',
    grade: '10' as const,
    packageTitleId: CLASS_ROSTERS['10 Khodijah'].packageTitleId,
    packageTitleEn: CLASS_ROSTERS['10 Khodijah'].packageTitleEn
  },
  {
    label: '10 Fatimah',
    grade: '10' as const,
    packageTitleId: CLASS_ROSTERS['10 Fatimah'].packageTitleId,
    packageTitleEn: CLASS_ROSTERS['10 Fatimah'].packageTitleEn
  },
  {
    label: '12 Saintek 4',
    grade: '12' as const,
    packageTitleId: CLASS_ROSTERS['12 Saintek 4'].packageTitleId,
    packageTitleEn: CLASS_ROSTERS['12 Saintek 4'].packageTitleEn
  },
  {
    label: '12 Saintek 5',
    grade: '12' as const,
    packageTitleId: CLASS_ROSTERS['12 Saintek 5'].packageTitleId,
    packageTitleEn: CLASS_ROSTERS['12 Saintek 5'].packageTitleEn
  },
  {
    label: '12 Saintek 6',
    grade: '12' as const,
    packageTitleId: CLASS_ROSTERS['12 Saintek 6'].packageTitleId,
    packageTitleEn: CLASS_ROSTERS['12 Saintek 6'].packageTitleEn
  }
];

export function getStudentsByClass(className: string): string[] {
  // Normalize match
  const foundKey = Object.keys(CLASS_ROSTERS).find(
    (k) => k.toLowerCase() === className.trim().toLowerCase()
  );
  if (!foundKey) return [];
  return [...CLASS_ROSTERS[foundKey].students];
}
