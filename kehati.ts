export type BiodiversityLevel = 'Gen' | 'Spesies' | 'Ekosistem';
export type BiogeographicZone = 'Oriental' | 'Peralihan' | 'Australis' | 'Bahari';
export type ConservationStatus = 'Kritis (CR)' | 'Genting (EN)' | 'Rentan (VU)' | 'Hampir Terancam (NT)' | 'Risiko Rendah (LC)';

export interface Organism {
  id: string;
  name: string;
  scientificName: string;
  type: 'fauna' | 'flora';
  level: BiodiversityLevel;
  zone: BiogeographicZone;
  status: ConservationStatus;
  habitat: string;
  description: string;
  funFact: string;
  icon: string;
  imageUrl?: string;
  threats: string[];
  conservationEffort: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: 'Tingkat Gen' | 'Tingkat Spesies' | 'Tingkat Ekosistem' | 'Garis Wallace-Weber' | 'Konservasi' | 'Ancaman Kehati';
  relatedOrganismId?: string;
}

export interface MazeCell {
  x: number;
  y: number;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
  item?: {
    type: 'specimen' | 'seed' | 'threat' | 'checkpoint' | 'key' | 'exit';
    organismId?: string;
    questionId?: string;
    collected?: boolean;
  };
}

export interface LevelConfig {
  id: string;
  title: string;
  subtitle: string;
  zone: BiogeographicZone;
  themeColor: string;
  badge: string;
  description: string;
  mazeSize: { width: number; height: number };
  targetSpecimens: number;
  targetQuestions: number;
  unlockedByDefault?: boolean;
}

export interface PlayerStats {
  seedsCollected: number;
  specimensFound: string[];
  quizzesAnswered: number;
  quizzesCorrect: number;
  completedLevels: string[];
  highScores: Record<string, number>;
}
