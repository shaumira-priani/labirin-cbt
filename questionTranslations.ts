import { Question, Language, GradeLevel, OptionKey } from '../types/exam';

export interface LocalizedQuestionContent {
  question: string;
  topic?: string;
  options: { key: OptionKey; text: string }[];
  explanation?: string;
  imageType?: Question['imageType'];
  imageUrl?: string;
  images?: Question['images'];
  imageCaption?: string;
}

// Sundanese and English translations for common UH Biologi questions
export const QUESTION_TRANSLATIONS: Record<
  'su' | 'en',
  Record<string, { question: string; options: Record<string, string>; topic?: string }>
> = {
  en: {
    '1': {
      question: 'Direct disposal of industrial waste into rivers can threaten aquatic biodiversity because...',
      topic: 'Threats & Aquatic Conservation',
      options: {
        A: 'Reduces dissolved oxygen levels and poisons aquatic organisms',
        B: 'Drastically increases fish populations',
        C: 'Accelerates coral reef growth',
        D: 'Has no impact on the aquatic food chain',
        E: 'Increases river water clarity'
      }
    },
    '2': {
      question: 'One sustainable biodiversity conservation strategy that involves local communities around protected areas is...',
      topic: 'Sustainable Conservation',
      options: {
        A: 'Completely banning community access without economic alternatives',
        B: 'Developing ecotourism and sustainable resource utilization involving local communities',
        C: 'Converting conservation areas into agricultural land',
        D: 'Allowing illegal poaching to continue',
        E: 'Revoking protected area status'
      }
    },
    '3': {
      question: 'The establishment of biosphere reserves by UNESCO aims to...',
      topic: 'Conservation Areas & Biosphere Reserves',
      options: {
        A: 'Protect ecosystems while supporting sustainable development for surrounding communities',
        B: 'Halt all human activities in an area',
        C: 'Convert forest areas into industrial zones',
        D: 'Abolish existing protected area status',
        E: 'Limit scientific research in conservation areas'
      }
    },
    '4': {
      question: 'Biodiversity conservation efforts carried out outside their natural habitats are known as ex-situ conservation, for example...',
      topic: 'Ex-Situ Conservation',
      options: {
        A: 'National parks',
        B: 'Wildlife sanctuaries',
        C: 'Zoos and botanical gardens',
        D: 'Nature reserves',
        E: 'Protected forests'
      }
    },
    '5': {
      question: 'Genetic level biodiversity can be observed from...',
      topic: 'Genetic Diversity',
      options: {
        A: 'Differences in fur color among cats within the same species',
        B: 'Differences between chickens and ducks',
        C: 'Differences between tropical rainforest and desert ecosystems',
        D: 'Differences in soil structure in various regions',
        E: 'Differences between tropical and subtropical climates'
      }
    },
    '37': {
      question: 'The three levels of biodiversity recognized in biological science are...',
      topic: 'Levels of Biodiversity',
      options: {
        A: 'Gene, species, and ecosystem',
        B: 'Population, community, and biome',
        C: 'Individual, population, and community',
        D: 'Cell, tissue, and organ',
        E: 'Producer, consumer, and decomposer'
      }
    }
  },
  su: {
    '1': {
      question: 'Pamiceunan limbah industri sacara langsung ka walungan tiasa ngabahayakeun kaanekaragaman hayati cai sabab...',
      topic: 'Ancaman & Konservasi Cai',
      options: {
        A: 'Nurunsurkeun kadar oksigen terlarut sarta ngaracunan organisme cai',
        B: 'Ngaronjatkeun populasi lauk sacara drastis',
        C: 'Ngagancangkeun tumuwuhna karang laut',
        D: 'Teu mangaruhan kana rantay kadaharan cai',
        E: 'Ngaronjatkeun caangna cai walungan'
      }
    },
    '4': {
      question: 'Upaya ngariksa kaanekaragaman hayati di luar habitat aslina disebut pelestarian ex-situ, contona...',
      topic: 'Pelestarian Ex-Situ',
      options: {
        A: 'Taman nasional',
        B: 'Suaka margasatwa',
        C: 'Kebon binatang sareng kebon raya',
        D: 'Cagar alam',
        E: 'Leuweung lindung'
      }
    },
    '37': {
      question: 'Tilu tingkatan kaanekaragaman hayati anu dipikawanoh dina elmu biologi nyaeta...',
      topic: 'Tingkatan Kaanekaragaman Hayati',
      options: {
        A: 'Gen, jenis (spesies), sareng ekosistem',
        B: 'Populasi, komunitas, sareng bioma',
        C: 'Individu, populasi, sareng komunitas',
        D: 'Sél, jaringan, sareng organ',
        E: 'Produsén, konsumén, sareng pangurai'
      }
    }
  }
};

export function getLocalizedQuestion(
  question: Question,
  language: Language,
  gradeLevel?: GradeLevel
): LocalizedQuestionContent {
  const baseContent: LocalizedQuestionContent = {
    question: question.question,
    topic: question.topic,
    options: question.options,
    explanation: question.explanation,
    imageType: question.imageType,
    imageUrl: question.imageUrl,
    images: question.images,
    imageCaption: question.imageCaption
  };

  if (language === 'id') {
    return baseContent;
  }

  const langKey = language === 'su' ? 'su' : 'en';
  const isGrade12 = gradeLevel === '12' || gradeLevel === 'K12';
  const prefix = isGrade12 ? 'k12_' : '';
  const translationKey = `${prefix}${question.id}`;
  const directKey = String(question.id);

  const matchedTranslation =
    QUESTION_TRANSLATIONS[langKey]?.[translationKey] ||
    QUESTION_TRANSLATIONS[langKey]?.[directKey];

  if (!matchedTranslation) {
    return baseContent;
  }

  const localizedOptions = question.options.map((opt) => {
    const translatedText = matchedTranslation.options[opt.key];
    return {
      key: opt.key,
      text: translatedText || opt.text
    };
  });

  return {
    ...baseContent,
    question: matchedTranslation.question || question.question,
    topic: matchedTranslation.topic || question.topic,
    options: localizedOptions
  };
}
