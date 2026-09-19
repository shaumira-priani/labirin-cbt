import { OptionKey, QuestionLocalized } from '../types/exam';

export const QUESTIONS_EN_K10: Record<number, QuestionLocalized> = {
  1: {
    topic: 'Aquatic Threats & Conservation',
    question: 'Direct discharge of untreated industrial waste into rivers threatens aquatic biodiversity because...',
    options: [
      { key: 'A', text: 'It depletes dissolved oxygen levels and poisons aquatic organisms' },
      { key: 'B', text: 'It drastically accelerates fish reproduction rates' },
      { key: 'C', text: 'It promotes rapid coral reef growth' },
      { key: 'D', text: 'It has no effect on aquatic trophic food webs' },
      { key: 'E', text: 'It enhances the clarity and purity of river water' }
    ],
    explanation: 'Industrial wastewater contains toxic chemicals and high organic loads that elevate Biochemical Oxygen Demand (BOD), severely depleting dissolved oxygen (DO) and intoxicating aquatic biota.'
  },
  2: {
    topic: 'Sustainable Conservation',
    question: 'A sustainable biodiversity conservation strategy that actively engages local communities around protected areas is...',
    options: [
      { key: 'A', text: 'Completely prohibiting community access without providing alternative economic livelihoods' },
      { key: 'B', text: 'Developing ecotourism and sustainable utilization of non-timber forest resources involving local communities' },
      { key: 'C', text: 'Converting protected nature reserves into commercial agricultural plantations' },
      { key: 'D', text: 'Allowing illegal wildlife hunting and logging to proceed unrestricted' },
      { key: 'E', text: 'Revoking the legally protected status of conservation areas' }
    ],
    explanation: 'Community-based conservation integrates ecotourism and sustainable harvesting of non-timber forest products (NTFP), providing economic incentives to preserve intact forests.'
  },
  3: {
    topic: 'Conservation Areas & Biosphere Reserves',
    question: 'The designation of Biosphere Reserves by UNESCO is aimed at...',
    options: [
      { key: 'A', text: 'Protecting ecosystems while fostering sustainable socio-economic development for surrounding communities' },
      { key: 'B', text: 'Completely stopping all human presence and scientific activity across an entire region' },
      { key: 'C', text: 'Transforming natural rainforests into heavy industrial manufacturing zones' },
      { key: 'D', text: 'Abolishing existing national park and nature reserve protections' },
      { key: 'E', text: 'Restricting modern scientific biological research within conservation areas' }
    ],
    explanation: 'UNESCO Biosphere Reserves utilize a three-zone framework (core, buffer, transition) to balance biodiversity conservation with sustainable socio-economic growth.'
  },
  4: {
    topic: 'Ex-Situ Conservation',
    question: 'The conservation of biodiversity outside its natural habitat is known as ex-situ conservation, such as...',
    options: [
      { key: 'A', text: 'National parks' },
      { key: 'B', text: 'Wildlife reserves' },
      { key: 'C', text: 'Zoological parks and botanical gardens' },
      { key: 'D', text: 'Strict nature reserves' },
      { key: 'E', text: 'Protected catchment forests' }
    ],
    explanation: 'Ex-situ conservation preserves plants and animals outside their natural habitats, such as in Botanical Gardens (e.g., Bogor) and Zoos / Safari Parks.'
  },
  5: {
    topic: 'Genetic Biodiversity',
    question: 'Biodiversity at the genetic level can be observed through...',
    options: [
      { key: 'A', text: 'Variations in fur coat color and pattern among domestic cats within a single species' },
      { key: 'B', text: 'Morphological differences between chickens and ducks' },
      { key: 'C', text: 'Ecological differences between tropical rainforests and desert biomes' },
      { key: 'D', text: 'Differences in soil mineral composition across geographical regions' },
      { key: 'E', text: 'Differences between tropical and temperate climatic zones' }
    ],
    explanation: 'Genetic biodiversity refers to allelic variation among individuals belonging to the same biological species (Felis catus), reflected in fur color, texture, or pattern.'
  },
  6: {
    topic: 'Global Zoogeographical Realms',
    question: 'The zoogeographical realm encompassing North America down to the northern highlands of Mexico is called the...',
    options: [
      { key: 'A', text: 'Neotropical Realm' },
      { key: 'B', text: 'Nearctic Realm' },
      { key: 'C', text: 'Palearctic Realm' },
      { key: 'D', text: 'Ethiopian Realm' },
      { key: 'E', text: 'Oriental Realm' }
    ],
    explanation: 'The Nearctic realm covers Greenland and North America down to central Mexico, featuring bison, grizzly bears, wild turkeys, and bighorn sheep.'
  },
  7: {
    topic: 'Ecological Benefits of Biodiversity',
    question: 'Forests functioning as primary water catchment zones that prevent floods and soil erosion represent biodiversity benefits in terms of...',
    options: [
      { key: 'A', text: 'Direct commercial economy' },
      { key: 'B', text: 'Ecology and ecosystem services' },
      { key: 'C', text: 'Cultural heritage' },
      { key: 'D', text: 'Visual aesthetics' },
      { key: 'E', text: 'Recreation' }
    ],
    explanation: 'Ecological services encompass life-support functions: hydrological regulation, erosion and flood mitigation, carbon sequestration, and oxygen production.'
  },
  8: {
    topic: 'Economic Benefits of Biodiversity',
    question: 'The utilization of teak wood (Tectona grandis) and meranti timber as raw materials for construction and furniture demonstrates biodiversity benefits in...',
    options: [
      { key: 'A', text: 'Economy' },
      { key: 'B', text: 'Ecology' },
      { key: 'C', text: 'Aesthetics' },
      { key: 'D', text: 'Education' },
      { key: 'E', text: 'Socio-culture' }
    ],
    explanation: 'The harvesting of biological forest resources that yields commercially marketable commodities and supports manufacturing represents economic benefits.'
  },
  9: {
    topic: 'Wallace Line & Biogeography',
    question: 'Alfred Russel Wallace established the boundary line dividing western and central Indonesian fauna based on his observation of...',
    options: [
      { key: 'A', text: 'Striking differences in climate across adjacent islands' },
      { key: 'B', text: 'Distinct differences in faunal species despite close geographical proximity, such as between Bali and Lombok' },
      { key: 'C', text: 'Differences in human population size on each island' },
      { key: 'D', text: 'Uniformity of plant flora throughout the entire archipelago' },
      { key: 'E', text: 'The geographic distribution of active volcanoes across Indonesia' }
    ],
    explanation: 'Wallace discovered that the narrow Lombok Strait marks a sharp transition between Oriental fauna (Bali) and Australasian/Transitional fauna (Lombok).'
  },
  10: {
    topic: 'Ecosystem Level Biodiversity',
    question: 'Biodiversity at the ecosystem level arises primarily from dynamic interactions between...',
    options: [
      { key: 'A', text: 'Genes and chromosomes' },
      { key: 'B', text: 'Biotic living communities and abiotic physical components' },
      { key: 'C', text: 'Individuals of the same species' },
      { key: 'D', text: 'DNA and RNA molecules' },
      { key: 'E', text: 'Male and female organisms' }
    ],
    explanation: 'Ecosystems are formed by complex reciprocal interactions between biological communities (biotic factors) and physical environment parameters (abiotic factors such as water, soil, light, climate).'
  },
  11: {
    topic: 'Threats to Biodiversity',
    question: 'Uncontrolled continuous poaching of the Javan rhinoceros (Rhinoceros sondaicus) will inevitably lead to...',
    options: [
      { key: 'A', text: 'A rapid population boom' },
      { key: 'B', text: 'Species extinction' },
      { key: 'C', text: 'Global climate reversal' },
      { key: 'D', text: 'An increase in genetic diversity' },
      { key: 'E', text: 'Expansion of natural habitat' }
    ],
    explanation: 'The Javan rhinoceros has a very low reproductive rate. Continued poaching exceeding the species regenerative capacity leads directly to population collapse and extinction.'
  },
  12: {
    topic: 'Western Indonesian Biome',
    question: 'Year-round high precipitation and warm tropical temperatures cause western Indonesia to be dominated by the biome of...',
    options: [
      { key: 'A', text: 'Tropical savanna' },
      { key: 'B', text: 'Tropical rainforest' },
      { key: 'C', text: 'Steppe grassland' },
      { key: 'D', text: 'Deciduous temperate forest' },
      { key: 'E', text: 'Tundra' }
    ],
    explanation: 'Warm temperatures (25–28°C) and heavy rainfall (>2000 mm/year) on the Sunda Shelf form tropical rainforest biomes with multi-layered canopies and the world’s highest terrestrial biodiversity.'
  },
  13: {
    topic: 'Weber Line & Biogeography',
    question: 'The imaginary line separating the transitional fauna zone (Wallacea) and the Australasian fauna zone in Indonesia is called the...',
    options: [
      { key: 'A', text: 'Wallace Line' },
      { key: 'B', text: 'Weber Line' },
      { key: 'C', text: 'Lydekker Line' },
      { key: 'D', text: 'Prime Meridian' },
      { key: 'E', text: 'Equator' }
    ],
    explanation: 'The Weber Line separates the Wallacea transitional zone (Sulawesi, Nusa Tenggara) from pure Australasian fauna (Papua and eastern Maluku).'
  },
  14: {
    topic: 'Factors of Indonesian Biodiversity',
    question: 'Ecosystem diversity in Indonesia is exceptionally high primarily because Indonesia is geographically situated as...',
    options: [
      { key: 'A', text: 'A landmass with a single uniform climate' },
      { key: 'B', text: 'An equatorial archipelagic nation with vast waters and diverse mountainous topography' },
      { key: 'C', text: 'A region completely devoid of volcanic activity' },
      { key: 'D', text: 'A continental territory located near the North Pole' },
      { key: 'E', text: 'A landmass receiving identical rainfall across all regions' }
    ],
    explanation: 'The equatorial location, complex archipelagic waters, and rugged tectonic mountain ranges create diverse microclimates from coastal mangroves and peat swamps to alpine montane forests.'
  },
  15: {
    topic: 'Scientific & Biotechnology Benefits',
    question: 'The benefits of biodiversity in the domain of scientific research and biotechnology are exemplified by...',
    options: [
      { key: 'A', text: 'Investigating novel species for pharmaceuticals and biotechnology development' },
      { key: 'B', text: 'Commercial export of raw timber logs abroad' },
      { key: 'C', text: 'Clear-cutting protected forests for residential suburbs' },
      { key: 'D', text: 'Commercial poaching of endangered wildlife' },
      { key: 'E', text: 'Converting natural rainforests into monoculture oil palm plantations' }
    ],
    explanation: 'The genetic and biochemical richness of living organisms provides essential raw materials for scientific exploration, bioprospecting, medical treatments, and future biotechnology.'
  },
  16: {
    topic: 'Pharmaceutical & Health Benefits',
    question: 'The utilization of medicinal plants as natural ingredients for traditional and modern medicines demonstrates biodiversity value in...',
    options: [
      { key: 'A', text: 'Pharmacy and healthcare' },
      { key: 'B', text: 'Agriculture' },
      { key: 'C', text: 'Tourism' },
      { key: 'D', text: 'Textile manufacturing' },
      { key: 'E', text: 'Commercial fisheries' }
    ],
    explanation: 'Secondary plant metabolites (such as curcumin in Curcuma and quinine in Cinchona) are foundational compounds in herbal remedies and pharmaceutical synthesis.'
  },
  17: {
    topic: 'Australasian Zoogeographical Realm',
    question: 'According to zoogeographical classification, the Australasian realm covers the territory of...',
    options: [
      { key: 'A', text: 'South America and Central America' },
      { key: 'B', text: 'Sub-Saharan Africa' },
      { key: 'C', text: 'Australia, New Zealand, Papua, and surrounding Pacific islands' },
      { key: 'D', text: 'South Asia and Southeast Asia' },
      { key: 'E', text: 'Europe and Northern Asia' }
    ],
    explanation: 'The Australasian realm spans the continent of Australia, New Zealand, Papua New Guinea, Papua (Indonesia), and neighboring oceanic islands.'
  },
  18: {
    topic: 'Distribution of Australasian Fauna in Indonesia',
    question: 'In Indonesia, fauna of the Australasian type is predominantly found in...',
    options: [
      { key: 'A', text: 'Sumatra' },
      { key: 'B', text: 'Java' },
      { key: 'C', text: 'Kalimantan' },
      { key: 'D', text: 'Papua' },
      { key: 'E', text: 'Sulawesi' }
    ],
    explanation: 'Papua and the Aru Islands lie on the Sahul Shelf, sharing fauna with Australia (marsupials, tree kangaroos, cassowaries, and birds of paradise).'
  },
  19: {
    topic: 'Invasive Species & Ecosystem Threats',
    question: 'The introduction of invasive alien species into an ecosystem threatens native biodiversity because...',
    options: [
      { key: 'A', text: 'Invasive species always go extinct immediately in new habitats' },
      { key: 'B', text: 'Invasive species can proliferate rapidly and outcompete or displace native species' },
      { key: 'C', text: 'They have zero interaction with ecological food webs' },
      { key: 'D', text: 'They stimulate population growth of native endemic fauna' },
      { key: 'E', text: 'They accelerate ecological succession directly to a climax state' }
    ],
    explanation: 'Lacking natural predators in new habitats, invasive species can proliferate rapidly, monopolize ecological niches, and prey on or displace native species.'
  },
  20: {
    topic: 'Population Genetics & Gene Variation',
    question: 'Random mating within a biological population increases biodiversity at the genetic level because...',
    options: [
      { key: 'A', text: 'It generates novel allele combinations among offspring' },
      { key: 'B', text: 'It eliminates existing genetic variation entirely' },
      { key: 'C', text: 'It makes all individuals phenotypically uniform' },
      { key: 'D', text: 'It alters the total number of distinct species in the biome' },
      { key: 'E', text: 'It has no effect on phenotypic inheritance' }
    ],
    explanation: 'Random mating maximizes genetic recombination during meiosis and fertilization, creating new combinations of gene alleles in offspring.'
  },
  21: {
    topic: 'Anthropogenic Threats',
    question: 'Which of the following represents a major threat to biodiversity caused directly by human activities?',
    options: [
      { key: 'A', text: 'Tectonic earthquakes' },
      { key: 'B', text: 'Deforestation and land-use conversion' },
      { key: 'C', text: 'Earth planetary rotation' },
      { key: 'D', text: 'Plant photosynthesis' },
      { key: 'E', text: 'The global water cycle' }
    ],
    explanation: 'Deforestation, habitat fragmentation, and clear-cutting for monocultures or mining represent direct anthropogenic causes of species loss.'
  },
  22: {
    topic: 'Ecotourism & Biodiversity Value',
    question: 'The presence of protected national parks developed as natural tourist destinations illustrates the benefit of biodiversity as...',
    options: [
      { key: 'A', text: 'A source of genetic germplasm exclusively' },
      { key: 'B', text: 'A source of national revenue and livelihoods through sustainable ecotourism' },
      { key: 'C', text: 'A local microclimate regulator only' },
      { key: 'D', text: 'A carbon sequestration reservoir only' },
      { key: 'E', text: 'A natural wilderness with zero economic value' }
    ],
    explanation: 'Nature-based ecotourism in National Parks like Komodo, Bunaken, or Bromo generates foreign exchange and local revenue while preserving ecosystems.'
  },
  23: {
    topic: 'Characteristics of Australasian Fauna',
    question: 'Distinctive characteristics of Australasian fauna include...',
    options: [
      { key: 'A', text: 'Abundance of diverse ape and monkey species' },
      { key: 'B', text: 'Prevalence of marsupial mammals and vibrantly colored birds such as birds of paradise' },
      { key: 'C', text: 'Native presence of tigers and leopards' },
      { key: 'D', text: 'Complete absence of avian bird species' },
      { key: 'E', text: 'Dominance of large placental land mammals like elephants' }
    ],
    explanation: 'Australasian fauna is dominated by marsupial mammals (such as cuscus and tree kangaroos), lacks large arboreal primates, and features distinctively colorful avifauna.'
  },
  24: {
    topic: 'Genetic Diversity',
    question: 'Differences in ear shape, coat color, and body size among various domestic dog breeds such as Chihuahua, Poodle, and Bulldog are examples of biodiversity at the level of...',
    options: [
      { key: 'A', text: 'Ecosystem' },
      { key: 'B', text: 'Gene' },
      { key: 'C', text: 'Species' },
      { key: 'D', text: 'Population' },
      { key: 'E', text: 'Community' }
    ],
    explanation: 'All domestic dog breeds belong to the same species (Canis lupus familiaris). Physical variations across breeds stem from differences in allelic genetic makeup (gene level).'
  },
  25: {
    topic: 'Coral Reef Ecosystem',
    question: 'The high biodiversity of coral reef ecosystems is critical for marine life because coral reefs function as...',
    options: [
      { key: 'A', text: 'Spawning grounds, feeding grounds, and nursery shelters for diverse marine organisms' },
      { key: 'B', text: 'The primary reservoir of freshwater for terrestrial animals' },
      { key: 'C', text: 'The sole generator of atmospheric oxygen on Earth' },
      { key: 'D', text: 'A containment basin for plastic marine debris' },
      { key: 'E', text: 'A thermal regulator for mainland coastal deserts' }
    ],
    explanation: 'Referred to as "rainforests of the sea," coral reefs provide crucial spawning (nursery), feeding, and sheltering grounds for over 25% of all marine species.'
  },
  26: {
    topic: 'Species-Level Biodiversity',
    question: 'An example of biodiversity at the species level is represented by the group of...',
    options: [
      { key: 'A', text: 'Coconut palm, betel nut palm, and sugar palm' },
      { key: 'B', text: 'IR64 rice, Ciherang rice, and Rojolele rice' },
      { key: 'C', text: 'Free-range chicken, broiler chicken, and Bangkok rooster' },
      { key: 'D', text: 'Red rose, white rose, and yellow rose' },
      { key: 'E', text: 'Goldfish of various colors' }
    ],
    explanation: 'Coconut (Cocos nucifera), betel nut (Areca catechu), and sugar palm (Arenga pinnata) are different species within the same family Arecaceae (Palmae), demonstrating species-level biodiversity.'
  },
  27: {
    topic: 'IUCN Conservation Status Categories',
    question: 'Under the IUCN Red List, the conservation status of a species that is no longer found in the wild but survives in captivity or cultivation is designated as...',
    options: [
      { key: 'A', text: 'Critically Endangered (CR)' },
      { key: 'B', text: 'Extinct in the Wild (EW)' },
      { key: 'C', text: 'Vulnerable (VU)' },
      { key: 'D', text: 'Near Threatened (NT)' },
      { key: 'E', text: 'Least Concern (LC)' }
    ],
    explanation: 'Extinct in the Wild (EW) classifies taxa that survive only in cultivation, captivity, or as naturalized populations outside their historic native range.'
  },
  28: {
    topic: 'Biodiversity Levels Concept',
    question: 'Consider the following groups: (1) Rice, corn, and wheat; (2) Manalagi mango, Gadung mango, and Harum Manis mango. Statement (1) represents diversity at the ... level, and (2) represents diversity at the ... level.',
    options: [
      { key: 'A', text: 'Ecosystem – gene' },
      { key: 'B', text: 'Species – gene' },
      { key: 'C', text: 'Gene – species' },
      { key: 'D', text: 'Species – ecosystem' },
      { key: 'E', text: 'Gene – ecosystem' }
    ],
    explanation: '(1) Rice, corn, and wheat are distinct species in Poaceae (species level). (2) Different mango cultivars are variations within a single species Mangifera indica (gene level).'
  },
  29: {
    topic: 'Wallacea Transitional Fauna Region',
    question: 'The transitional fauna region (Wallacea type) in Indonesia encompasses...',
    options: [
      { key: 'A', text: 'Sumatra, Java, and Kalimantan' },
      { key: 'B', text: 'Papua and the Maluku Islands' },
      { key: 'C', text: 'Sulawesi, Nusa Tenggara, and Maluku' },
      { key: 'D', text: 'Sumatra and Papua' },
      { key: 'E', text: 'Java and Bali' }
    ],
    explanation: 'Wallacea lies between the Wallace Line and the Weber/Lydekker Line, covering Sulawesi, West and East Nusa Tenggara, and the Maluku archipelago.'
  },
  30: {
    topic: 'Allelic Variation at Genetic Level',
    question: 'In a domestic cat population, variations in black, white, and calico coat colors are observed. This phenomenon is caused by...',
    options: [
      { key: 'A', text: 'Different species within the family Felidae' },
      { key: 'B', text: 'Differential expression of inherited gene alleles from parent organisms' },
      { key: 'C', text: 'Differences in ecological biomes inhabited' },
      { key: 'D', text: 'Abiotic environmental factors such as ambient temperature' },
      { key: 'E', text: 'Differences in trophic levels' }
    ],
    explanation: 'Phenotypic coat color variations in the same species are governed by differential expressions of gene alleles inherited from parent cats.'
  },
  31: {
    topic: 'Endemic Fauna of Wallacea',
    question: 'Examples of fauna endemic strictly to the Wallacea (transitional) region are...',
    options: [
      { key: 'A', text: 'Orangutans' },
      { key: 'B', text: 'Komodo dragons and anoas' },
      { key: 'C', text: 'Sumatran elephants' },
      { key: 'D', text: 'Red kangaroos' },
      { key: 'E', text: 'Greater birds of paradise' }
    ],
    explanation: 'Komodo dragons (Komodo/Flores), Anoa, Babirusa, and Maleo birds (Sulawesi) are endemic to Wallacea and found neither in Sunda nor Sahul.'
  },
  32: {
    topic: 'Characteristics of Ecosystem Components',
    question: 'Paddy fields, tropical rainforests, and coral reefs differ fundamentally from one another primarily due to differences in...',
    options: [
      { key: 'A', text: 'Total number of genes in a single population' },
      { key: 'B', text: 'Climatic conditions, soil/water parameters, and abiotic components' },
      { key: 'C', text: 'Color pigmentation of living organisms' },
      { key: 'D', text: 'Modes of organismal reproduction' },
      { key: 'E', text: 'Surface area of geographic territories' }
    ],
    explanation: 'Each ecosystem is defined by specific abiotic parameters (temperature, rainfall, salinity, substrate) that shape the composition of biotic communities.'
  },
  33: {
    topic: 'Characteristics of Asiatic (Oriental) Fauna',
    question: 'Fauna of western Indonesia (Asiatic / Sundaic type) is characterized by...',
    options: [
      { key: 'A', text: 'An abundance of marsupial mammals' },
      { key: 'B', text: 'Presence of large placental mammals such as elephants, one-horned rhinos, and tigers' },
      { key: 'C', text: 'Presence of birds of paradise' },
      { key: 'D', text: 'Presence of tree kangaroos' },
      { key: 'E', text: 'Complete absence of mammals' }
    ],
    explanation: 'Asiatic fauna (Sunda Shelf: Sumatra, Java, Kalimantan) features large placental mammals such as Asian elephants, Javan rhinos, tigers, and orangutans.'
  },
  34: {
    topic: 'Ecological Role in Food Chains',
    question: 'Biodiversity plays an indispensable role in maintaining the balance of food chains because...',
    options: [
      { key: 'A', text: 'Every organism occupies a distinct ecological niche and trophic role in the ecosystem' },
      { key: 'B', text: 'All organisms perform identical ecological tasks' },
      { key: 'C', text: 'Only apex predators matter in ecosystem stability' },
      { key: 'D', text: 'Primary producers have no impact on ecological balance' },
      { key: 'E', text: 'Food chains are completely independent of species diversity' }
    ],
    explanation: 'Each species occupies a specific ecological niche as a producer, consumer, detritivore, or decomposer. Loss of any species can disrupt food web resilience.'
  },
  35: {
    topic: 'Palearctic Zoogeographical Realm',
    question: 'The zoogeographical realm that spans Europe, northern Asia, and North Africa (north of the Sahara Desert) is called the...',
    options: [
      { key: 'A', text: 'Neotropical Realm' },
      { key: 'B', text: 'Nearctic Realm' },
      { key: 'C', text: 'Palearctic Realm' },
      { key: 'D', text: 'Oriental Realm' },
      { key: 'E', text: 'Ethiopian Realm' }
    ],
    explanation: 'The Palearctic realm encompasses most of Eurasia (Europe and northern Asia/Russia) along with the Mediterranean coastal belt of North Africa.'
  },
  36: {
    topic: 'Wallace Line (Asiatic - Transitional)',
    question: 'The line separating the Asiatic fauna region from the transitional fauna region in Indonesia is called the...',
    options: [
      { key: 'A', text: 'Wallace Line' },
      { key: 'B', text: 'Weber Line' },
      { key: 'C', text: 'Equator' },
      { key: 'D', text: 'Prime Meridian' },
      { key: 'E', text: 'Tropic of Cancer' }
    ],
    explanation: 'The Wallace Line runs through the Makassar Strait (between Kalimantan and Sulawesi) and the Lombok Strait (between Bali and Lombok).'
  },
  37: {
    topic: 'Levels of Biodiversity',
    question: 'The three fundamental hierarchical levels of biodiversity recognized in biological sciences are...',
    options: [
      { key: 'A', text: 'Gene, species, and ecosystem' },
      { key: 'B', text: 'Population, community, and biome' },
      { key: 'C', text: 'Individual, population, and community' },
      { key: 'D', text: 'Cell, tissue, and organ' },
      { key: 'E', text: 'Producer, consumer, and decomposer' }
    ],
    explanation: 'Biodiversity is scientifically categorized into three hierarchical levels: genetic diversity (allele variations), species diversity, and ecosystem diversity.'
  },
  38: {
    topic: 'In-Situ Conservation',
    question: 'The conservation of biodiversity conducted directly within its natural habitat is called...',
    options: [
      { key: 'A', text: 'In-situ conservation, such as national parks and wildlife sanctuaries' },
      { key: 'B', text: 'Ex-situ conservation, such as zoological gardens' },
      { key: 'C', text: 'Artificial propagation' },
      { key: 'D', text: 'Transitory protection' },
      { key: 'E', text: 'Domestication' }
    ],
    explanation: 'In-situ conservation protects flora and fauna in their natural habitats without removing individuals, such as in National Parks and Nature Reserves.'
  },
  39: {
    topic: 'Gene Banks & Germplasm Conservation',
    question: 'The establishment of gene banks primarily aims to...',
    options: [
      { key: 'A', text: 'Store and preserve genetic germplasm of diverse species for future resilience and research' },
      { key: 'B', text: 'Maximize short-term commercial crop harvest sales' },
      { key: 'C', text: 'Reduce the number of wild species in natural ecosystems' },
      { key: 'D', text: 'Accelerate natural extinction processes' },
      { key: 'E', text: 'Replace the physical function of national parks' }
    ],
    explanation: 'Gene banks cryogenically preserve seeds, pollen, spores, or tissue DNA to safeguard genetic germplasm against extinction and environmental crises.'
  },
  40: {
    topic: 'Australasian Characteristic Flora',
    question: 'Characteristic flora commonly found in eastern Indonesia (such as Papua) that exhibits close affinity with the Australian continent includes...',
    options: [
      { key: 'A', text: 'Meranti and ironwood (ulin)' },
      { key: 'B', text: 'Matoa (Pometia pinnata) and various Eucalyptus species' },
      { key: 'C', text: 'Sandalwood and cinnamon' },
      { key: 'D', text: 'Mangroves and nipa palms' },
      { key: 'E', text: 'Moon orchids and pitcher plants' }
    ],
    explanation: 'Papuan flora (Sahul Shelf) shares close affinities with Australia, characterized by Eucalyptus trees, matoa, and characteristic Australasian fig trees.'
  },
  41: {
    topic: 'Genetic Biodiversity',
    imageCaption: 'Phenotypic variations in coat color, fur density, and facial structure in domestic cats (Felis catus)',
    question: 'Observe the phenotypic variations of the domestic cats shown in the image above! The phenotypic differences such as fur pattern, coat thickness, and facial contours among these cats demonstrate biodiversity at the level of...',
    options: [
      { key: 'A', text: 'Gene level, because it occurs within the same biological species (Felis catus) due to different combinations of alleles' },
      { key: 'B', text: 'Species level, because each of these cats has a different scientific taxonomic name' },
      { key: 'C', text: 'Ecosystem level, because they inhabit different domestic and climate environments' },
      { key: 'D', text: 'Phylogenetic level, because they belong to completely separated mammalian orders' },
      { key: 'E', text: 'Population level, because it indicates spatial dispersion of wild feline groups' }
    ],
    explanation: 'Variations among individuals of the same biological species (Felis catus) represent biodiversity at the genetic level.'
  },
  42: {
    topic: 'Species-Level Biodiversity',
    imageCaption: 'Comparison of three carnivore species within the genus Panthera (family Felidae)',
    question: 'Observe the three carnivorous felines shown in the image above! The Tiger (Panthera tigris), Lion (Panthera leo), and Leopard (Panthera pardus) are categorized into species-level biodiversity because...',
    options: [
      { key: 'A', text: 'They belong to the same genus (Panthera) but represent distinct biological species with specific morphological and physiological traits, and do not produce fertile offspring when intercrossed' },
      { key: 'B', text: 'They possess 100% identical chromosome structures that are only modified by environmental living conditions' },
      { key: 'C', text: 'They belong to a single homogeneous population undergoing geographic isolation across continents' },
      { key: 'D', text: 'They represent genetic-level diversity resulting from human artificial mutations' },
      { key: 'E', text: 'They represent ecosystem diversity between savannah and tropical rainforests' }
    ],
    explanation: 'Tigers, lions, and leopards are distinct species belonging to the same genus (Panthera), illustrating species-level (inter-species) biodiversity.'
  },
  43: {
    topic: 'Indonesian Biogeography & Weber Line',
    imageCaption: 'Biogeographical boundary map of the Indonesian archipelago (Wallace Line & Weber Line)',
    question: 'Observe the biogeographical map of Indonesia above! The imaginary line indicated by number 2 and its function in biogeography is...',
    options: [
      { key: 'A', text: 'Weber Line, which is the boundary line separating the Transitional (Wallacea) fauna zone from the Australasian fauna zone (Papua and surrounding islands)' },
      { key: 'B', text: 'Wallace Line, which is the boundary separating Asiatic fauna from Transitional fauna' },
      { key: 'C', text: 'Lydekker Line, which is the continental shelf boundary along the Sahul border' },
      { key: 'D', text: 'Equator, which is the zero-degree latitude line dividing wet and dry tropical climates' },
      { key: 'E', text: 'Isobar Line, which connects points of equal atmospheric pressure across Maluku' }
    ],
    explanation: 'The Wallace Line separates the Oriental (Asiatic) zone from Wallacea. The Weber Line (number 2) separates Wallacea from the Australasian zone (Papua & Maluku).'
  },
  44: {
    topic: 'Habitat Fragmentation Threats',
    imageCaption: 'Highway road construction dividing natural tropical forest ecosystem',
    question: 'Observe the road construction slicing through the natural forest ecosystem in the image above! The clearing of forest tracts for major highway construction (habitat fragmentation) poses a grave threat to biodiversity conservation because...',
    options: [
      { key: 'A', text: 'It severs wildlife migration corridors, exacerbates edge effects, constricts home ranges, and dramatically elevates risks of roadkills and illegal poaching access' },
      { key: 'B', text: 'It accelerates the behavioral adaptation of wild fauna into human-friendly domestic animals' },
      { key: 'C', text: 'It increases forest carrying capacity by promoting roadside rainwater drainage' },
      { key: 'D', text: 'It enhances agricultural crop biodiversity along cleared highway margins' },
      { key: 'E', text: 'It naturally prevents spontaneous forest wildfires between fragmented forest parcels' }
    ],
    explanation: 'Constructing highways through contiguous forests fragments habitats into isolated patches, disrupting wildlife corridors, causing edge effects, and facilitating illegal poaching and roadkills.'
  },
  45: {
    topic: 'In-Situ vs Ex-Situ Conservation',
    imageCaption: 'Comparison of In-Situ Conservation (National Park) and Ex-Situ Conservation (Botanical Garden / Safari Park)',
    question: 'Observe the two biodiversity conservation programs in the image above! The fundamental distinction between In-Situ conservation (as in Image 1: Komodo National Park) and Ex-Situ conservation (as in Image 2: Bogor Botanical Gardens) is...',
    options: [
      { key: 'A', text: 'In-Situ conservation is conducted directly within the native natural habitat to preserve the intact ecosystem, whereas Ex-Situ conservation is conducted outside natural habitats for breeding, rehabilitation, research, or germplasm security' },
      { key: 'B', text: 'In-Situ conservation is reserved exclusively for rare plants, whereas Ex-Situ is strictly for large mammals' },
      { key: 'C', text: 'In-Situ conservation relocates wildlife into artificial enclosures, whereas Ex-Situ leaves wildlife in nature' },
      { key: 'D', text: 'Ex-Situ conservation aims to produce genetically mutated species, whereas In-Situ is for commercial wildlife trade' },
      { key: 'E', text: 'In-Situ conservation is temporary, whereas Ex-Situ is mandatory for the lifetime of the organism' }
    ],
    explanation: 'In-situ conservation takes place in the native wild habitat (National Parks, Wildlife Reserves), while ex-situ conservation takes place in managed facilities outside native ranges (Botanical Gardens, Zoos, Gene Banks).'
  }
};

export const QUESTIONS_EN_K12: Record<number, QuestionLocalized> = {
  1: {
    topic: 'Properties & Characteristics of Enzymes',
    question: 'Enzymes function as biocatalysts in cellular metabolism. The most accurate statement regarding the mechanism of enzyme action is that enzymes...',
    options: [
      { key: 'A', text: 'Lower the activation energy without being permanently consumed in the reaction' },
      { key: 'B', text: 'Increase the total final quantity of products yielded from substrates' },
      { key: 'C', text: 'Permanently alter their chemical structure once the reaction concludes' },
      { key: 'D', text: 'Halt all non-beneficial chemical reactions within the organism' },
      { key: 'E', text: 'Require extremely high temperatures above 100°C to initiate activity' }
    ],
    explanation: 'Enzymes act as biocatalysts that accelerate chemical reaction rates by lowering the activation energy barrier without shifting equilibrium or being consumed.'
  },
  2: {
    topic: 'Enzyme Action Model (Lock and Key)',
    question: 'According to the Lock and Key hypothesis, an enzyme and its substrate bind with exact precision because...',
    options: [
      { key: 'A', text: 'The substrate melts and integrates seamlessly into the enzyme protein structure' },
      { key: 'B', text: 'The active site of the enzyme possesses a rigid, specific 3D conformation complementary to the substrate' },
      { key: 'C', text: 'The active site of the enzyme is highly flexible and constantly changes its spatial geometry' },
      { key: 'D', text: 'A single enzyme can simultaneously bind to all arbitrary substrate shapes' },
      { key: 'E', text: 'The catalytic reaction proceeds without requiring direct physical contact between enzyme and substrate' }
    ],
    explanation: 'The Lock and Key model proposed by Emil Fischer posits that the active site has a rigid, complementary shape fitting only one specific substrate, analogous to a key fitting into a lock.'
  },
  3: {
    topic: 'Enzyme Action Model (Induced Fit)',
    question: 'According to the Induced Fit model, what occurs when a substrate molecule enters the active site of an enzyme?',
    options: [
      { key: 'A', text: 'The substrate reshapes itself into an entirely rigid geometry' },
      { key: 'B', text: 'The active site undergoes a slight conformational change to snugly bind and clasp the substrate' },
      { key: 'C', text: 'The enzyme breaks down completely and regenerates a new molecule' },
      { key: 'D', text: 'The chemical reaction pauses until surrounding environmental temperature rises' },
      { key: 'E', text: 'The substrate undergoes self-cleavage prior to touching the active site' }
    ],
    explanation: 'The Induced Fit model (Koshland) describes the active site as flexible, undergoing subtle conformational adjustments upon substrate binding to optimize catalytic contact.'
  },
  4: {
    topic: 'Competitive Inhibition',
    question: 'A chemical compound possesses a molecular spatial structure closely resembling the natural substrate, thereby competing directly for the active site of the enzyme. This inhibitor is termed a...',
    options: [
      { key: 'A', text: 'Non-competitive inhibitor' },
      { key: 'B', text: 'Auxiliary coenzyme' },
      { key: 'C', text: 'Competitive inhibitor' },
      { key: 'D', text: 'Enzyme activator' },
      { key: 'E', text: 'Metabolic byproduct' }
    ],
    explanation: 'A competitive inhibitor mimics the substrate structural shape and binds directly to the active site, competing with the substrate for catalytic occupancy.'
  },
  5: {
    topic: 'Non-Competitive Inhibition',
    question: 'A non-competitive inhibitor decreases or stops the catalytic rate of an enzyme by...',
    options: [
      { key: 'A', text: 'Binding to an allosteric site other than the active site, inducing a conformational change in the active site' },
      { key: 'B', text: 'Binding directly to the active site to physically block substrate entry' },
      { key: 'C', text: 'Oxidizing and degrading the substrate before contact with the enzyme' },
      { key: 'D', text: 'Lowering the intracellular concentration of water and mineral ions' },
      { key: 'E', text: 'Precisely mimicking the physical shape of the substrate molecule' }
    ],
    explanation: 'Non-competitive inhibitors bind to an allosteric site (outside the active site), altering the tertiary conformation of the active site so substrates can no longer be catalyzed effectively.'
  },
  6: {
    topic: 'Catalase Enzyme Experiment',
    question: 'Catalase enzyme, abundant in liver tissue, functions to decompose toxic metabolic byproducts. The correct decomposition reaction catalyzed is...',
    options: [
      { key: 'A', text: 'Decomposing Pyruvate into Lactic Acid and metabolic energy' },
      { key: 'B', text: 'Decomposing Hydrogen Peroxide (H2O2) into Water (H2O) and Oxygen Gas (O2)' },
      { key: 'C', text: 'Decomposing Glucose into Carbon Dioxide (CO2) and Ethanol' },
      { key: 'D', text: 'Decomposing Triglycerides into Fatty Acids and Glycerol' },
      { key: 'E', text: 'Decomposing Carbon Dioxide (CO2) into Oxygen Gas (O2)' }
    ],
    explanation: 'Catalase accelerates the breakdown of cytotoxic hydrogen peroxide into benign water and oxygen: 2 H2O2 -> 2 H2O + O2.'
  },
  7: {
    topic: 'Catalase Experiment (Temperature Effect)',
    question: 'In a laboratory catalase assay, fresh liver extract treated with H2O2 produces abundant gas bubbles and rekindles a glowing splint. However, when the liver extract is first boiled at 100°C and then treated with H2O2, no bubbles appear and the splint is extinguished. This demonstrates that...',
    options: [
      { key: 'A', text: 'The H2O2 solution completely evaporated during the boiling process' },
      { key: 'B', text: 'Catalase enzyme undergoes denaturation (structural breakdown of tertiary protein) at high temperatures' },
      { key: 'C', text: 'Catalase freezes permanently at the boiling point of water' },
      { key: 'D', text: 'The generated oxygen gas was too dense, thereby extinguishing the ember' },
      { key: 'E', text: 'Catalase can only function actively in alkaline basic environments' }
    ],
    explanation: 'Enzymes are thermolabile proteins. Extreme heat disrupts tertiary hydrogen and ionic bonds (denaturation), destroying the catalytic active site.'
  },
  8: {
    topic: 'Catalase Experiment (pH Effect)',
    imageCaption: 'Experimental data table of catalase activity across varying pH and environmental treatments',
    question: 'Observe the catalase experiment data table in the image above!\n\nThe most appropriate conclusion derived from the data is...',
    options: [
      { key: 'A', text: 'Catalase enzyme exhibits maximal catalytic activity in a neutral environment (pH 7)' },
      { key: 'B', text: 'Catalase enzyme functions most optimally in strongly acidic conditions' },
      { key: 'C', text: 'HCl and NaOH act as catalytic activators for catalase enzyme' },
      { key: 'D', text: 'The degree of acidity (pH) has no impact on catalase activity' },
      { key: 'E', text: 'Liver extract is degraded when placed in neutral solutions' }
    ],
    explanation: 'Based on the experimental data, maximum gas bubbles (+++) and vigorous flame rekindling occur exclusively at neutral pH (pH 7), proving that catalase operates optimally in neutral conditions.'
  },
  9: {
    topic: 'Catalase Experiment (Glowing Splint Test)',
    question: 'During the reaction of liver extract with H2O2, the emergence of gas bubbles that vigorously rekindle a glowing wood splint into an open flame proves that the generated gas is...',
    options: [
      { key: 'A', text: 'Carbon Monoxide Gas (CO)' },
      { key: 'B', text: 'Carbon Dioxide Gas (CO2)' },
      { key: 'C', text: 'Hydrogen Gas (H2)' },
      { key: 'D', text: 'Oxygen Gas (O2)' },
      { key: 'E', text: 'Nitrogen Gas (N2)' }
    ],
    explanation: 'Oxygen gas (O2) supports combustion; thus, presenting a glowing ember near the test tube ignites it into a flame.'
  },
  10: {
    topic: 'Substrate Concentration Factor',
    question: 'If the concentration of enzyme in a reaction vessel is kept constant while substrate concentration is continuously increased, the reaction velocity initially rises and then plateaus (reaches a constant maximum). The cause of this plateau is that...',
    options: [
      { key: 'A', text: 'The enzyme has reached saturation because all active sites are occupied by substrate molecules' },
      { key: 'B', text: 'The enzyme undergoes physical breakdown due to substrate crowding' },
      { key: 'C', text: 'A spontaneous drop in reaction temperature occurs' },
      { key: 'D', text: 'The substrate transforms into a competitive inhibitor' },
      { key: 'E', text: 'The reaction reverses direction, cleaving enzymes into amino acids' }
    ],
    explanation: 'At high substrate concentrations, the reaction rate reaches maximum velocity (Vmax) because all available enzyme active sites are saturated with substrate.'
  },
  11: {
    topic: 'Stages of Aerobic Respiration',
    question: 'The correct chronological sequence of stages in complete cellular aerobic respiration of glucose is...',
    options: [
      { key: 'A', text: 'Glycolysis -> Oxidative Decarboxylation -> Krebs Cycle -> Electron Transport Chain' },
      { key: 'B', text: 'Krebs Cycle -> Glycolysis -> Oxidative Decarboxylation -> Electron Transport Chain' },
      { key: 'C', text: 'Glycolysis -> Krebs Cycle -> Oxidative Decarboxylation -> Electron Transport Chain' },
      { key: 'D', text: 'Oxidative Decarboxylation -> Glycolysis -> Krebs Cycle -> Electron Transport Chain' },
      { key: 'E', text: 'Electron Transport Chain -> Krebs Cycle -> Glycolysis -> Oxidative Decarboxylation' }
    ],
    explanation: 'Aerobic cellular respiration proceeds through Glycolysis (cytosol), Oxidative Decarboxylation (mitochondrial matrix), Krebs Cycle (mitochondrial matrix), and Electron Transport Chain (cristae).'
  },
  12: {
    topic: 'Glycolysis Stage',
    question: 'Glycolysis takes place in the cytoplasm (cytosol) of the cell. The central biochemical event occurring during glycolysis is the cleavage of...',
    options: [
      { key: 'A', text: 'Pyruvate into Carbon Dioxide gas and Ethanol' },
      { key: 'B', text: '1 molecule of Glucose (6C) into 2 molecules of Pyruvate (3C)' },
      { key: 'C', text: '1 molecule of Glucose directly into 36 molecules of ATP without intermediates' },
      { key: 'D', text: 'Acetyl-CoA into Citric Acid inside the mitochondrial matrix' },
      { key: 'E', text: 'Water molecules into Oxygen Gas and Hydrogen ions' }
    ],
    explanation: 'Glycolysis breaks down one 6-carbon glucose molecule into two 3-carbon pyruvate molecules within the cytosol.'
  },
  13: {
    topic: 'Net Yield of Glycolysis',
    question: 'From the breakdown of 1 glucose molecule undergoing glycolysis, the net products generated are...',
    options: [
      { key: 'A', text: '2 Acetyl-CoA, 2 FADH2, and 4 ATP' },
      { key: 'B', text: '2 Lactic Acid, 2 CO2, and 2 ATP' },
      { key: 'C', text: '2 Pyruvate, 2 NADH, and 2 ATP' },
      { key: 'D', text: '1 Pyruvate, 1 NADH, and 36 ATP' },
      { key: 'E', text: '2 Pyruvate, 2 CO2, and 2 FADH2' }
    ],
    explanation: 'Glycolysis generates 4 gross ATP while consuming 2 ATP in its investment phase, yielding a net of 2 Pyruvate, 2 NADH, and 2 ATP.'
  },
  14: {
    topic: 'Oxidative Decarboxylation',
    question: 'During Oxidative Decarboxylation in the mitochondrial matrix, each 3-carbon Pyruvate molecule is converted into...',
    options: [
      { key: 'A', text: 'Citric Acid (6C) with the consumption of ATP energy' },
      { key: 'B', text: 'Acetyl-CoA (2C) with the release of CO2 gas and reduction of NAD+ to NADH' },
      { key: 'C', text: 'Lactic Acid without producing carbon dioxide gas' },
      { key: 'D', text: 'Regenerated Glucose to conserve cellular energy stores' },
      { key: 'E', text: 'Oxygen gas and Water molecules' }
    ],
    explanation: 'Each pyruvate undergoes decarboxylation to release CO2, reduces NAD+ to NADH, and attaches to Coenzyme A to form 2-carbon Acetyl-CoA.'
  },
  15: {
    topic: 'Krebs Cycle & CO2 Release',
    question: 'The Krebs Cycle (Citric Acid Cycle) occurs within the mitochondrial matrix. The metabolic byproduct Carbon Dioxide (CO2) exhaled during respiration is predominantly generated during...',
    options: [
      { key: 'A', text: 'Glycolysis in the cytosol' },
      { key: 'B', text: 'Electron Transport Chain across mitochondrial cristae' },
      { key: 'C', text: 'The Krebs Cycle and Oxidative Decarboxylation inside the mitochondria' },
      { key: 'D', text: 'Photolysis reactions inside chloroplasts' },
      { key: 'E', text: 'Protein synthesis at ribosomal complexes' }
    ],
    explanation: 'All 6 carbons of glucose are released as CO2 during Oxidative Decarboxylation (2 CO2) and the Krebs Cycle (4 CO2 per glucose).'
  },
  16: {
    topic: 'HOTS Analogy: Hydroelectric Dam & Chemical Battery',
    question: 'Consider a Hydroelectric Power Plant analogy:\n"Water held in an elevated reservoir holds tremendous potential energy. When the floodgates open, rushing water spins the generator turbine, converting mechanical kinetic energy into electricity stored neatly inside compact portable rechargeable batteries."\nIf this analogy is mapped to cellular respiration, the rushing water spinning the turbine and the energy packed into small batteries correspond respectively to...',
    options: [
      { key: 'A', text: 'The proton/electron flow across ATP Synthase enzyme; and cellular ATP energy molecules' },
      { key: 'B', text: 'Intact glucose molecules; and Carbon Dioxide exhaust gas' },
      { key: 'C', text: 'Catalase enzyme molecules; and cytosolic calcium ions' },
      { key: 'D', text: 'Pyruvate molecules; and atmospheric free oxygen gas' },
      { key: 'E', text: 'Cytoplasm fluid; and the outer mitochondrial membrane' }
    ],
    explanation: 'Protons (H+) streaming down their electrochemical gradient spin the rotor of ATP Synthase (like water spinning a turbine), synthesizing ATP molecules (the universal rechargeable energy currency of cells).'
  },
  17: {
    topic: 'HOTS Analogy: River Mouth & Terminal Electron Acceptor',
    question: 'Continuing the reservoir analogy, once water has spun the turbine, it discharges into the river mouth downstream. In the cellular electron transport chain, the substance acting as the final electron/hydrogen acceptor and the resulting product formed are...',
    options: [
      { key: 'A', text: 'Carbon Dioxide (CO2) forming Glucose' },
      { key: 'B', text: 'Nitrogen Gas (N2) forming Ammonia' },
      { key: 'C', text: 'Oxygen Gas (O2) forming Water molecules (H2O)' },
      { key: 'D', text: 'Pyruvate forming Lactic Acid' },
      { key: 'E', text: 'ATP Synthase forming ADP' }
    ],
    explanation: 'Molecular oxygen (O2) serves as the terminal electron acceptor in aerobic respiration, accepting electrons and protons to form metabolic water (H2O).'
  },
  18: {
    topic: 'Function of Electron Transport Chain',
    question: 'The electron transport chain is embedded in the mitochondrial inner membrane (cristae). The primary function of the electron transport system is to...',
    options: [
      { key: 'A', text: 'Convert the high-energy electrons of NADH and FADH2 into readily usable ATP via oxidative phosphorylation' },
      { key: 'B', text: 'Cleave glucose into pyruvate within the cytosol' },
      { key: 'C', text: 'Generate maximum quantities of Carbon Dioxide gas' },
      { key: 'D', text: 'Trap glucose to prevent leakage across the plasma membrane' },
      { key: 'E', text: 'Store excess glucose as glycogen in hepatic tissue' }
    ],
    explanation: 'The ETC transfers electrons from NADH and FADH2 through protein complexes to build a proton gradient across the inner membrane, powering large-scale ATP synthesis via chemiosmosis.'
  },
  19: {
    topic: 'Role of NADH & FADH2 Molecules',
    question: 'The NADH and FADH2 coenzyme molecules generated from glycolysis, oxidative decarboxylation, and the Krebs cycle function as...',
    options: [
      { key: 'A', text: 'Enzymes that dissolve the nuclear envelope during mitosis' },
      { key: 'B', text: 'High-energy electron and hydrogen carriers delivered to the electron transport chain' },
      { key: 'C', text: 'Direct combustible fuels burned without enzymatic intermediaries' },
      { key: 'D', text: 'Cytotoxic waste products destined for immediate excretion' },
      { key: 'E', text: 'Structural building blocks for newly forming plant cell walls' }
    ],
    explanation: 'NADH and FADH2 act as mobile coenzyme carriers transporting reducing equivalents (electrons and H+) to the mitochondrial electron transport chain.'
  },
  20: {
    topic: 'Total Net ATP Yield in Aerobic Respiration',
    question: 'Overall, the complete aerobic oxidation of 1 glucose molecule through all stages of cellular respiration yields a net total of approximately...',
    options: [
      { key: 'A', text: '2 ATP' },
      { key: 'B', text: '4 ATP' },
      { key: 'C', text: '36 to 38 ATP' },
      { key: 'D', text: '100 ATP' },
      { key: 'E', text: '1 ATP' }
    ],
    explanation: 'Complete aerobic oxidation of 1 glucose yields roughly 36 to 38 ATP (or 30–32 ATP in modern stoichiometric estimates, traditionally tabulated as 36–38 ATP in standard curricula).'
  },
  21: {
    topic: 'Conditions for Anaerobic Respiration',
    question: 'Anaerobic respiration or fermentation is initiated by cells when...',
    options: [
      { key: 'A', text: 'The availability of Oxygen gas (O2) in the cellular environment is absent or insufficient' },
      { key: 'B', text: 'The environmental temperature reaches the freezing point of water' },
      { key: 'C', text: 'All intracellular glucose reserves have been completely exhausted' },
      { key: 'D', text: 'Mitochondrial enzymes exceed their maximum kinetic speed limit' },
      { key: 'E', text: 'Atmospheric Carbon Dioxide levels drop excessively low' }
    ],
    explanation: 'In the absence of oxygen, the mitochondrial electron transport chain halts. Cells switch to anaerobic fermentation to re-oxidize NADH back to NAD+ to keep glycolysis functioning.'
  },
  22: {
    topic: 'Lactic Acid Fermentation in Muscles',
    question: 'During strenuous physical exercise or sudden sprinting when oxygen delivery is limited, skeletal muscle cells perform anaerobic respiration that produces...',
    options: [
      { key: 'A', text: 'Ethanol alcohol that impairs neuromuscular coordination' },
      { key: 'B', text: 'Lactic Acid, which contributes to muscle fatigue and soreness' },
      { key: 'C', text: 'Carbon Dioxide bubbles that rupture muscle tissue' },
      { key: 'D', text: 'An additional 36 ATP within milliseconds' },
      { key: 'E', text: 'Pure oxygen gas inside the sarcoplasm' }
    ],
    explanation: 'Under anaerobic debt, pyruvate is reduced to lactic acid by lactate dehydrogenase. Accumulation of lactic acid lowers cytosolic pH and contributes to muscle stiffness and fatigue.'
  },
  23: {
    topic: 'Products of Lactic Acid Fermentation',
    question: 'During the process of lactic acid fermentation, the breakdown of 1 glucose molecule yields...',
    options: [
      { key: 'A', text: '2 Lactic Acid molecules and 2 ATP (without releasing CO2 gas)' },
      { key: 'B', text: '2 Alcohol molecules and 36 ATP' },
      { key: 'C', text: '2 Pyruvate molecules and 4 CO2' },
      { key: 'D', text: '1 Glucose molecule and 2 Water molecules' },
      { key: 'E', text: '2 Acetic Acid molecules and Oxygen gas' }
    ],
    explanation: 'Lactic acid fermentation converts 1 glucose (6C) into 2 lactic acid (3C) molecules and 2 net ATP, without releasing CO2.'
  },
  24: {
    topic: 'Alcohol Fermentation (Bread Dough Rising)',
    question: 'In bread making using baker’s yeast (Saccharomyces cerevisiae), bread dough expands and rises because alcohol fermentation releases...',
    options: [
      { key: 'A', text: 'Oxygen Gas (O2) produced from water splitting' },
      { key: 'B', text: 'Carbon Dioxide Gas (CO2) that becomes trapped within the dough gluten matrix' },
      { key: 'C', text: 'Lactic acid vapor that hollows the dough' },
      { key: 'D', text: 'Extremely lightweight Hydrogen gas' },
      { key: 'E', text: 'Heat that spontaneously toasts flour starches' }
    ],
    explanation: 'Decarboxylation of pyruvate into acetaldehyde releases CO2 gas bubbles that become trapped in the gluten network, causing dough to rise.'
  },
  25: {
    topic: 'Aroma of Fermented Foods & Ethanol',
    question: 'During the fermentation of cassava or glutinous rice into traditional "tape", a distinct aroma and sweet, mildly alcoholic flavor develop. The chemical compound responsible for this characteristic flavor is...',
    options: [
      { key: 'A', text: 'Lactic Acid' },
      { key: 'B', text: 'Concentrated Citric Acid' },
      { key: 'C', text: 'Ethanol (Ethyl Alcohol)' },
      { key: 'D', text: 'Pure Acetic Acid (Vinegar)' },
      { key: 'E', text: 'Raw Amylose Starch' }
    ],
    explanation: 'Yeast enzymes hydrolyze starches into simple sugars and ferment glucose into ethanol and CO2, imparting the sweet-alcoholic bouquet.'
  },
  26: {
    topic: 'Energy Efficiency: Aerobic vs Anaerobic',
    question: 'Aerobic respiration generates significantly more energy (36–38 ATP) than anaerobic fermentation (only 2 ATP). This stark difference occurs because in fermentation...',
    options: [
      { key: 'A', text: 'Glucose is only partially broken down, leaving most chemical energy locked in organic end products (lactate/ethanol)' },
      { key: 'B', text: 'Cells do not employ any metabolic enzymes whatsoever' },
      { key: 'C', text: 'ATP molecules are destroyed by the lack of oxygen' },
      { key: 'D', text: 'All chemical energy is converted into toxic gases for mitochondria' },
      { key: 'E', text: 'Glucose is directly polymerized into structural cell wall amino acids' }
    ],
    explanation: 'In fermentation, the carbon skeleton of glucose is not completely oxidized to CO2 and H2O; high-energy C-H and C-C bonds remain stored within lactate or ethanol.'
  },
  27: {
    topic: 'Location of Cellular Fermentation',
    question: 'All steps of anaerobic fermentation (both lactic acid fermentation and alcohol fermentation) take place in the...',
    options: [
      { key: 'A', text: 'Mitochondrial Matrix' },
      { key: 'B', text: 'Mitochondrial Cristae Membrane' },
      { key: 'C', text: 'Cytoplasm (Cytosol)' },
      { key: 'D', text: 'Nucleus' },
      { key: 'E', text: 'Chloroplast Stroma' }
    ],
    explanation: 'Anaerobic fermentation bypasses mitochondrial organelles completely and occurs entirely in the cytosol.'
  },
  28: {
    topic: 'Lactic Acid vs Alcoholic Fermentation',
    question: 'A fundamental biochemical distinction between lactic acid fermentation and alcoholic fermentation is that...',
    options: [
      { key: 'A', text: 'Alcoholic fermentation releases CO2 gas and produces ethanol, whereas lactic acid fermentation produces lactic acid without releasing CO2' },
      { key: 'B', text: 'Lactic acid fermentation yields 36 ATP, whereas alcohol fermentation yields only 2 ATP' },
      { key: 'C', text: 'Lactic acid fermentation requires free oxygen, whereas alcohol fermentation does not' },
      { key: 'D', text: 'Alcoholic fermentation occurs in human muscle cells, whereas lactic acid fermentation occurs in yeast' },
      { key: 'E', text: 'Lactic acid fermentation takes place in mitochondria, whereas alcohol fermentation occurs in ribosomes' }
    ],
    explanation: 'Lactic acid fermentation does not release CO2 (yielding 3C lactic acid), whereas alcohol fermentation cleaves CO2 to produce 2C acetaldehyde and then 2C ethanol.'
  },
  29: {
    topic: 'Site of Photosynthetic Light Reactions',
    question: 'The photosynthetic process that directly requires solar photon energy (Light-Dependent Reactions) takes place in which chloroplast structure?',
    options: [
      { key: 'A', text: 'Stroma (chloroplast fluid matrix)' },
      { key: 'B', text: 'Thylakoid Membrane (Grana)' },
      { key: 'C', text: 'Outer Chloroplast Membrane' },
      { key: 'D', text: 'Leaf Cuticle Cell Wall' },
      { key: 'E', text: 'Mesophyll Cytosol' }
    ],
    explanation: 'Chlorophyll pigments, photosystems I & II, and the photosynthetic electron transport chain reside embedded in thylakoid membranes organized as grana.'
  },
  30: {
    topic: 'Role of Light & Chlorophyll',
    question: 'In the light-dependent reactions of photosynthesis, the primary function of chlorophyll pigments in leaves is to...',
    options: [
      { key: 'A', text: 'Absorb solar photon energy to excite electrons to higher energy states' },
      { key: 'B', text: 'Directly absorb atmospheric Carbon Dioxide gas' },
      { key: 'C', text: 'Bind glucose molecules to prevent dissolution in cellular water' },
      { key: 'D', text: 'Prevent transpirational water loss through leaf stomata' },
      { key: 'E', text: 'Burn metabolic waste compounds' }
    ],
    explanation: 'Chlorophyll pigments absorb light wavelengths (chiefly blue and red) to drive electron excitation in photosystem reaction centers.'
  },
  31: {
    topic: 'Photolysis of Water',
    question: 'The light-driven splitting of water molecules (H2O) during the light-dependent reactions of photosynthesis is termed photolysis. The products of water photolysis are...',
    options: [
      { key: 'A', text: 'Carbon Dioxide Gas (CO2) and Glucose' },
      { key: 'B', text: 'Oxygen Gas (O2), Hydrogen ions (H+), and electrons' },
      { key: 'C', text: 'Pyruvate and ATP molecules' },
      { key: 'D', text: 'Starch polymers and newly synthesized Water' },
      { key: 'E', text: 'Nitrogen gas and Oxygen gas' }
    ],
    explanation: 'Photolysis of water (2 H2O -> 4 H+ + 4 e- + O2) replenishes electrons in Photosystem II, releases H+ into the thylakoid lumen, and liberates O2 into the atmosphere.'
  },
  32: {
    topic: 'Origin of Photosynthetic Oxygen Gas',
    question: 'The oxygen gas (O2) released by green plants, which sustains aerobic life on Earth, originates directly from...',
    options: [
      { key: 'A', text: 'The cleavage of Carbon Dioxide gas (CO2) during the Calvin cycle' },
      { key: 'B', text: 'The photolysis splitting of Water molecules (H2O) in light reactions' },
      { key: 'C', text: 'The nighttime catabolism of stored starch' },
      { key: 'D', text: 'The reaction of glucose with stroma fluid' },
      { key: 'E', text: 'Evaporation of soil water through stomatal pores' }
    ],
    explanation: 'Isotopic tracer experiments (Ruben and Kamen) confirmed that photosynthetic O2 is released exclusively from the photolysis of water (H2O), not from CO2.'
  },
  33: {
    topic: 'Light Reaction Products for Calvin Cycle',
    question: 'The light-dependent reactions generate two high-energy compounds that are indispensable for driving the Calvin cycle (dark reactions). These two compounds are...',
    options: [
      { key: 'A', text: 'Glucose and Oxygen Gas' },
      { key: 'B', text: 'Carbon Dioxide and Water' },
      { key: 'C', text: 'ATP and NADPH' },
      { key: 'D', text: 'Pyruvate and FADH2' },
      { key: 'E', text: 'RuBP and Citric Acid' }
    ],
    explanation: 'Light reactions supply chemical energy (ATP) and reducing power (NADPH) required for the reduction and regeneration phases of the Calvin cycle.'
  },
  34: {
    topic: 'Thylakoid ATP Synthase Enzyme',
    question: 'In the thylakoid membrane, the synthesis of ATP from ADP and inorganic phosphate occurs as hydrogen ions (protons) flow through a specialized enzyme called...',
    options: [
      { key: 'A', text: 'Catalase' },
      { key: 'B', text: 'ATP Synthase' },
      { key: 'C', text: 'Amylase' },
      { key: 'D', text: 'RuBisCO' },
      { key: 'E', text: 'Peptidase' }
    ],
    explanation: 'Chemiosmotic photophosphorylation is catalyzed by ATP Synthase as protons flow down their electrochemical gradient from the thylakoid lumen into the stroma.'
  },
  35: {
    topic: 'Interdependence of Light & Dark Reactions',
    question: 'If a photosynthetic plant is placed in continuous total darkness, the Calvin cycle (dark reactions) will eventually grind to a halt because...',
    options: [
      { key: 'A', text: 'The supply of ATP and NADPH produced by the light reactions is exhausted' },
      { key: 'B', text: 'Chlorophyll pigments completely evaporate from leaf chloroplasts' },
      { key: 'C', text: 'Leaves lose the ability to absorb oxygen from the air' },
      { key: 'D', text: 'The stroma fluid freezes instantaneously without sunlight' },
      { key: 'E', text: 'Glucose turns into a toxin for plant cells' }
    ],
    explanation: 'Although the Calvin cycle does not require photons directly, it is completely reliant on continuous replenishment of ATP and NADPH from light reactions.'
  },
  36: {
    topic: 'Site of Dark Reactions (Calvin Cycle)',
    question: 'The light-independent reactions of photosynthesis (Calvin Cycle) take place in which chloroplast compartment?',
    options: [
      { key: 'A', text: 'Thylakoid Membrane' },
      { key: 'B', text: 'Grana' },
      { key: 'C', text: 'Stroma (chloroplast fluid matrix)' },
      { key: 'D', text: 'Outer Chloroplast Membrane' },
      { key: 'E', text: 'Chloroplast Ribosomes' }
    ],
    explanation: 'The Calvin cycle enzymes (including RuBisCO) are soluble proteins located in the stroma, the dense aqueous matrix of the chloroplast.'
  },
  37: {
    topic: 'Carbon Fixation & RuBisCO Enzyme',
    question: 'In the initial phase of the Calvin Cycle (Carbon Fixation), atmospheric Carbon Dioxide (CO2) is fixed onto a 5-carbon compound (RuBP) catalyzed by the primary enzyme...',
    options: [
      { key: 'A', text: 'Catalase' },
      { key: 'B', text: 'Pepsin' },
      { key: 'C', text: 'RuBisCO (Ribulose-1,5-bisphosphate carboxylase-oxygenase)' },
      { key: 'D', text: 'Trypsin' },
      { key: 'E', text: 'Lipase' }
    ],
    explanation: 'RuBisCO catalyzes the covalent attachment of CO2 to 5-carbon RuBP, forming an unstable 6C intermediate that cleaves into two 3-PGA molecules.'
  },
  38: {
    topic: 'Reduction Phase of Calvin Cycle',
    question: 'During the reduction phase of the Calvin Cycle, 3-PGA molecules are phosphorylated and reduced to high-energy PGAL (G3P) molecules using energy supplied by...',
    options: [
      { key: 'A', text: 'ATP and NADPH produced by the light reactions' },
      { key: 'B', text: 'Oxygen gas and Water molecules' },
      { key: 'C', text: 'Direct solar photon irradiation' },
      { key: 'D', text: 'Hepatic catalase enzymes' },
      { key: 'E', text: 'Lactic acid and Carbon Dioxide gas' }
    ],
    explanation: 'ATP provides phosphate energy and NADPH provides reducing electrons to convert 3-PGA into glyceraldehyde-3-phosphate (G3P / PGAL).'
  },
  39: {
    topic: 'Regeneration Phase of RuBP',
    question: 'In the final phase of the Calvin Cycle, most G3P (PGAL) molecules are rearranged in a series of ATP-fueled reactions to reconstitute RuBP so the cycle can continue. This phase is called...',
    options: [
      { key: 'A', text: 'Carbon Fixation' },
      { key: 'B', text: 'Regeneration of RuBP' },
      { key: 'C', text: 'Cytosolic Glycolysis' },
      { key: 'D', text: 'Chlorophyll Photolysis' },
      { key: 'E', text: 'Carbohydrate Fermentation' }
    ],
    explanation: 'For every 6 G3P produced, 5 G3P are recycled through the regeneration phase (using 3 ATP) to reform 3 molecules of RuBP.'
  },
  40: {
    topic: 'Final Synthesis of Glucose',
    question: 'Simple carbohydrate / sugar molecules (Glucose), which serve as primary nutrients for plants and heterotrophs, are directly assembled during...',
    options: [
      { key: 'A', text: 'Light Reactions from the photolysis of water' },
      { key: 'B', text: 'The Electron Transport Chain in mitochondrial cristae' },
      { key: 'C', text: 'Glycolysis inside the cytoplasm' },
      { key: 'D', text: 'The Calvin Cycle (Dark Reactions) by combining exported G3P (PGAL) triose phosphates' },
      { key: 'E', text: 'Chlorophyll photolysis in thylakoid membranes' }
    ],
    explanation: 'Two molecules of 3-carbon G3P (PGAL) exported from the Calvin cycle condense into one 6-carbon glucose molecule in the stroma and cytoplasm.'
  }
};

/**
 * Returns the localized question object based on active language and grade level.
 * Grade 10 uses QUESTIONS_EN_K10 (IDs 1–45).
 * Grade 12 uses QUESTIONS_EN_K12 (IDs 1–40).
 */
export function getLocalizedQuestion(question: any, lang: 'id' | 'en', gradeLevel?: string) {
  if (!question) return question;
  if (lang === 'id') return question;

  const isK12 = gradeLevel === '12';
  const translationTable = isK12 ? QUESTIONS_EN_K12 : QUESTIONS_EN_K10;
  const translation = translationTable[question.id];

  if (!translation) return question;

  return {
    ...question,
    question: translation.question || question.question,
    options: question.options.map((opt: any) => {
      const match = translation.options?.find((o) => o.key === opt.key);
      return match ? { ...opt, text: match.text } : opt;
    }),
    topic: translation.topic || question.topic,
    explanation: translation.explanation || question.explanation,
    imageCaption: translation.imageCaption || question.imageCaption
  };
}
