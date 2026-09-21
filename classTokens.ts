// ============================================================================
// TOKEN AKSES UJIAN PER KELAS (UNTUK MENCEGAH KEBOCORAN & AKSES PREMATUR)
// ============================================================================

export interface ClassTokenInfo {
  className: string;
  grade: string;
  token: string;
  topic: string;
}

export const CLASS_TOKENS: Record<string, string> = {
  '10 Khodijah': 'bismillah',
  '10 Khadijah': 'bismillah',
  '10 Fatimah': 'udah',
  '12 Saintek 4': 'basmalahdulu',
  '12 Saintek 5': 'done',
  '12 Saintek 6': 'bismillahlancar'
};

export const CLASS_TOKEN_LIST: ClassTokenInfo[] = [
  {
    className: '10 Khodijah',
    grade: 'Kelas X',
    token: 'bismillah',
    topic: 'Keanekaragaman Hayati'
  },
  {
    className: '10 Fatimah',
    grade: 'Kelas X',
    token: 'udah',
    topic: 'Keanekaragaman Hayati'
  },
  {
    className: '12 Saintek 4',
    grade: 'Kelas XII',
    token: 'basmalahdulu',
    topic: 'Enzim & Metabolisme Sel'
  },
  {
    className: '12 Saintek 5',
    grade: 'Kelas XII',
    token: 'done',
    topic: 'Enzim & Metabolisme Sel'
  },
  {
    className: '12 Saintek 6',
    grade: 'Kelas XII',
    token: 'bismillahlancar',
    topic: 'Enzim & Metabolisme Sel'
  }
];

export function getExpectedTokenForClass(className: string): string {
  if (!className) return 'bismillah';
  const normalized = className.trim().toLowerCase();

  for (const [key, token] of Object.entries(CLASS_TOKENS)) {
    const normKey = key.toLowerCase();
    if (
      normalized === normKey ||
      normalized.includes(normKey) ||
      normKey.includes(normalized)
    ) {
      return token;
    }
  }

  // Fallback for custom class
  if (normalized.includes('12') || normalized.includes('xii')) {
    if (normalized.includes('4')) return 'basmalahdulu';
    if (normalized.includes('5')) return 'done';
    if (normalized.includes('6')) return 'bismillahlancar';
    return 'basmalahdulu';
  }

  if (normalized.includes('fatimah')) return 'udah';
  if (normalized.includes('khodijah') || normalized.includes('khadijah')) return 'bismillah';

  return 'bismillah';
}

export function validateClassToken(
  className: string,
  inputToken: string
): { valid: boolean; expectedToken: string } {
  const expected = getExpectedTokenForClass(className);
  const cleanInput = (inputToken || '').trim().toLowerCase();
  const cleanExpected = expected.trim().toLowerCase();

  return {
    valid: cleanInput === cleanExpected,
    expectedToken: expected
  };
}
