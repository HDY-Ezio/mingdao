/**
 * I Ching (易经) Data - 六十四卦基础数据
 * Complete 64 hexagrams with bilingual text
 * 
 * Contains:
 * - 8 Trigrams (八卦)
 * - 64 Hexagrams (六十四卦)
 * - Hexagram names, judgments, and line texts (卦名、卦辞、爻辞)
 * - Bilingual (Chinese + English)
 */

// ============================================================================
// Eight Trigrams (八卦)
// ============================================================================

export interface Trigram {
  id: number        // 0-7 (binary: 000-111, bottom to top)
  name: string      // English name
  nameCn: string    // Chinese name
  pinyin: string
  element: string
  elementCn: string
  nature: string
  natureCn: string
  symbol: string    // ☰☱☲☳☴☵☶☷
  binary: number[]  // lines from bottom to top, 1=yang, 0=yin
}

export const EIGHT_TRIGRAMS: Trigram[] = [
  // 111 - 乾 ☰
  {
    id: 7,
    name: 'Heaven',
    nameCn: '乾',
    pinyin: 'Qián',
    element: 'Metal',
    elementCn: '金',
    nature: 'Creative',
    natureCn: '健',
    symbol: '☰',
    binary: [1, 1, 1],
  },
  // 110 - 兑 ☱
  {
    id: 6,
    name: 'Lake',
    nameCn: '兑',
    pinyin: 'Duì',
    element: 'Metal',
    elementCn: '金',
    nature: 'Joyous',
    natureCn: '悦',
    symbol: '☱',
    binary: [1, 1, 0],
  },
  // 101 - 离 ☲
  {
    id: 5,
    name: 'Fire',
    nameCn: '离',
    pinyin: 'Lí',
    element: 'Fire',
    elementCn: '火',
    nature: 'Clinging',
    natureCn: '丽',
    symbol: '☲',
    binary: [1, 0, 1],
  },
  // 100 - 震 ☳
  {
    id: 4,
    name: 'Thunder',
    nameCn: '震',
    pinyin: 'Zhèn',
    element: 'Wood',
    elementCn: '木',
    nature: 'Arousing',
    natureCn: '动',
    symbol: '☳',
    binary: [1, 0, 0],
  },
  // 011 - 巽 ☴
  {
    id: 3,
    name: 'Wind',
    nameCn: '巽',
    pinyin: 'Xùn',
    element: 'Wood',
    elementCn: '木',
    nature: 'Gentle',
    natureCn: '入',
    symbol: '☴',
    binary: [0, 1, 1],
  },
  // 010 - 坎 ☵
  {
    id: 2,
    name: 'Water',
    nameCn: '坎',
    pinyin: 'Kǎn',
    element: 'Water',
    elementCn: '水',
    nature: 'Abysmal',
    natureCn: '陷',
    symbol: '☵',
    binary: [0, 1, 0],
  },
  // 001 - 艮 ☶
  {
    id: 1,
    name: 'Mountain',
    nameCn: '艮',
    pinyin: 'Gèn',
    element: 'Earth',
    elementCn: '土',
    nature: 'Still',
    natureCn: '止',
    symbol: '☶',
    binary: [0, 0, 1],
  },
  // 000 - 坤 ☷
  {
    id: 0,
    name: 'Earth',
    nameCn: '坤',
    pinyin: 'Kūn',
    element: 'Earth',
    elementCn: '土',
    nature: 'Receptive',
    natureCn: '顺',
    symbol: '☷',
    binary: [0, 0, 0],
  },
]

// Get trigram by binary (bottom to top: 3 lines)
export function getTrigramByBinary(binary: number[]): Trigram {
  const id = binary[0] * 4 + binary[1] * 2 + binary[2] * 1
  return EIGHT_TRIGRAMS.find(t => t.id === id) || EIGHT_TRIGRAMS[0]
}

// ============================================================================
// 64 Hexagrams (六十四卦)
// ============================================================================

export interface HexagramLine {
  position: number     // 1-6 (bottom to top)
  text: string         // English line text
  textCn: string       // Chinese line text
}

export interface Hexagram {
  number: number       // 1-64
  name: string         // English name
  nameCn: string       // Chinese name (two characters)
  pinyin: string
  judgment: string     // English judgment text
  judgmentCn: string   // Chinese judgment text (卦辞)
  image: string        // English image text
  imageCn: string      // Chinese image text (象辞)
  upperTrigram: number // upper trigram id
  lowerTrigram: number // lower trigram id
  lines: HexagramLine[]
  category: string     // Category for grouping
}

// 六十四卦核心数据 (精简版，用于MVP展示)
// 按周易上经下经顺序排列
export const SIXTY_FOUR_HEXAGRAMS: Hexagram[] = [
  // ===== 上经 30卦 =====
  {
    number: 1,
    name: 'Creative Heaven',
    nameCn: '乾为天',
    pinyin: 'Qián Wéi Tiān',
    judgment: 'Supreme success. Perseverance furthers.',
    judgmentCn: '元亨利贞。',
    image: 'The movement of heaven is full of power. Thus the superior man makes himself strong and untiring.',
    imageCn: '天行健，君子以自强不息。',
    upperTrigram: 7,
    lowerTrigram: 7,
    lines: [
      { position: 1, text: 'Hidden dragon. Do not act.', textCn: '潜龙勿用。' },
      { position: 2, text: 'Dragon appearing in the field. It furthers one to see the great man.', textCn: '见龙在田，利见大人。' },
      { position: 3, text: 'All day long the superior man is creatively active. At nightfall his mind is still beset with cares. Danger. No blame.', textCn: '君子终日乾乾，夕惕若厉，无咎。' },
      { position: 4, text: 'Wavering flight over the depths. No blame.', textCn: '或跃在渊，无咎。' },
      { position: 5, text: 'Flying dragon in the heavens. It furthers one to see the great man.', textCn: '飞龙在天，利见大人。' },
      { position: 6, text: 'Arrogant dragon will have cause to repent.', textCn: '亢龙有悔。' },
    ],
    category: 'Heaven & Earth',
  },
  {
    number: 2,
    name: 'Receptive Earth',
    nameCn: '坤为地',
    pinyin: 'Kūn Wéi Dì',
    judgment: 'Supreme success. The perseverance of a mare is favorable. The superior man has something to undertake. If he tries to lead, he goes astray; if he follows, he finds guidance. It is favorable to find friends in the west and south, to forego friends in the east and north. Quiet perseverance brings good fortune.',
    judgmentCn: '元亨，利牝马之贞。君子有攸往，先迷后得主，利西南得朋，东北丧朋。安贞吉。',
    image: 'The earth\'s condition is receptive devotion. Thus the superior man who has breadth of character carries the outer world.',
    imageCn: '地势坤，君子以厚德载物。',
    upperTrigram: 0,
    lowerTrigram: 0,
    lines: [
      { position: 1, text: 'When there is hoarfrost underfoot, solid ice is on the way.', textCn: '履霜，坚冰至。' },
      { position: 2, text: 'Straight, square, great. Without purpose, yet nothing remains unfurthered.', textCn: '直方大，不习无不利。' },
      { position: 3, text: 'Hidden lines. One is able to remain persevering. If by chance you are in the service of a king, seek not works, but bring to completion.', textCn: '含章可贞。或从王事，无成有终。' },
      { position: 4, text: 'A tied-up sack. No blame, no praise.', textCn: '括囊，无咎无誉。' },
      { position: 5, text: 'A yellow lower garment brings supreme good fortune.', textCn: '黄裳元吉。' },
      { position: 6, text: 'Dragons fight in the meadow. Their blood is black and yellow.', textCn: '龙战于野，其血玄黄。' },
    ],
    category: 'Heaven & Earth',
  },
  {
    number: 3,
    name: 'Difficulty at the Beginning',
    nameCn: '水雷屯',
    pinyin: 'Shuǐ Léi Zhūn',
    judgment: 'Difficulty at the Beginning works supreme success, furthering through perseverance. Nothing should be undertaken. It furthers one to appoint helpers.',
    judgmentCn: '元亨利贞，勿用有攸往，利建侯。',
    image: 'Clouds and thunder: the image of Difficulty at the Beginning. Thus the superior man brings order out of confusion.',
    imageCn: '云雷，屯。君子以经纶。',
    upperTrigram: 2,
    lowerTrigram: 4,
    lines: [
      { position: 1, text: 'Standstill. It furthers one to abide in what one is doing. It furthers one to appoint helpers.', textCn: '磐桓，利居贞，利建侯。' },
      { position: 2, text: 'Difficulties pile up. He is hemmed in. A man and a woman are not united. The woman does not allow herself to be wooed. Only after ten years does she submit.', textCn: '屯如邅如，乘马班如。匪寇婚媾，女子贞不字，十年乃字。' },
      { position: 3, text: 'Whoever hunts deer without the forester only loses his way in the forest. The superior man understands the signs of the time and prefers to desist. To go on brings humiliation.', textCn: '即鹿无虞，惟入于林中。君子几不如舍，往吝。' },
      { position: 4, text: 'Mounted and ready to advance. If you seek union with the right person, all goes well.', textCn: '乘马班如，求婚媾。往吉，无不利。' },
      { position: 5, text: 'Draining the marsh but one cannot empty it. Perseverance in the face of difficulty brings good fortune.', textCn: '屯其膏，小贞吉，大贞凶。' },
      { position: 6, text: 'Mounted and ready to advance. One weeps tears of blood.', textCn: '乘马班如，泣血涟如。' },
    ],
    category: 'Growth & Transition',
  },
  {
    number: 4,
    name: 'Youthful Folly',
    nameCn: '山水蒙',
    pinyin: 'Shān Shuǐ Méng',
    judgment: 'Youthful Folly has success. It is not I who seek the young fool; the young fool seeks me. At the first oracle I inform him. If he asks a second and third time, I give him no more information. Perseverance furthers.',
    judgmentCn: '亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。',
    image: 'A spring wells up at the foot of the mountain: the image of Youth. Thus the superior man yields to the quality of the moment and encourages virtue.',
    imageCn: '山下出泉，蒙。君子以果行育德。',
    upperTrigram: 1,
    lowerTrigram: 2,
    lines: [
      { position: 1, text: 'To make a fool develop is a blessing. It furthers to use punishments for instruction. But if one uses harsh measures, remorse follows.', textCn: '发蒙，利用刑人，用说桎梏，以往吝。' },
      { position: 2, text: 'A man holds his son firm. Good fortune. He has the patience to educate the young. He achieves something.', textCn: '包蒙，吉。纳妇吉，子克家。' },
      { position: 3, text: 'Do not take a woman who lets her eyes wander. If she sees a man of wealth, she loses her composure. Nothing that furthers.', textCn: '勿用取女，见金夫，不有躬，无攸利。' },
      { position: 4, text: 'Foolish ignorance. Humiliation.', textCn: '困蒙，吝。' },
      { position: 5, text: 'The youthful folly of the simple and trusting brings good fortune.', textCn: '童蒙，吉。' },
      { position: 6, text: 'To punish fools is not a curse but a blessing. What brings misfortune is lawlessness.', textCn: '击蒙，不利为寇，利御寇。' },
    ],
    category: 'Growth & Transition',
  },
  {
    number: 5,
    name: 'Waiting',
    nameCn: '水天需',
    pinyin: 'Shuǐ Tiān Xū',
    judgment: 'Waiting. If you are sincere, you have success in your heart, and all the conditions are favorable. It furthers one to cross the great water.',
    judgmentCn: '有孚，光亨，贞吉。利涉大川。',
    image: 'Clouds rise up to heaven: the image of Waiting. Thus the superior man eats and drinks, is joyous and of good cheer.',
    imageCn: '云上于天，需。君子以饮食宴乐。',
    upperTrigram: 2,
    lowerTrigram: 7,
    lines: [
      { position: 1, text: 'Waiting in the meadow. It furthers one to abide in what one is doing. No blame.', textCn: '需于郊，利用恒，无咎。' },
      { position: 2, text: 'Waiting on the sand. Some gossip comes, but in the end there is good fortune.', textCn: '需于沙，小有言，终吉。' },
      { position: 3, text: 'Waiting in the mud. The enemy approaches.', textCn: '需于泥，致寇至。' },
      { position: 4, text: 'Waiting in blood. Leave the cave.', textCn: '需于血，出自穴。' },
      { position: 5, text: 'Waiting in the place of sacrifice. If you are sincere, you will attain your goal.', textCn: '需于酒食，贞吉。' },
      { position: 6, text: 'One falls into the pit. Three uninvited guests arrive. Honored, they bring good fortune.', textCn: '入于穴，有不速之客三人来，敬之终吉。' },
    ],
    category: 'Growth & Transition',
  },
  {
    number: 6,
    name: 'Conflict',
    nameCn: '天水讼',
    pinyin: 'Tiān Shuǐ Sòng',
    judgment: 'Conflict. You are sincere and are being obstructed. A cautious halt halfway brings good fortune. Going through with it to the end brings misfortune. It furthers one to see the great man. It does not further one to cross the great water.',
    judgmentCn: '有孚，窒惕，中吉，终凶。利见大人，不利涉大川。',
    image: 'Heaven and water go their opposite ways: the image of Conflict. Thus the superior man in all his beginnings plans carefully.',
    imageCn: '天与水违行，讼。君子以作事谋始。',
    upperTrigram: 7,
    lowerTrigram: 2,
    lines: [
      { position: 1, text: 'One does not remain forever in a petty affair. There is some gossip, but in the end it turns out well.', textCn: '不永所事，小有言，终吉。' },
      { position: 2, text: 'One cannot engage in conflict. One returns and hides among his people, who are three hundred households. No blame.', textCn: '不克讼，归而逋，其邑人三百户，无眚。' },
      { position: 3, text: 'To nourish oneself on ancient virtue brings perseverance. Danger, but in the end good fortune. If by chance you are in the service of a king, seek not works.', textCn: '食旧德，贞厉，终吉。或从王事，无成。' },
      { position: 4, text: 'One cannot engage in conflict. One turns back and submits to fate, changes one\'s mind, and finds peace in perseverance. Good fortune.', textCn: '不克讼，复即命，渝，安贞吉。' },
      { position: 5, text: 'To contend before the supreme ruler brings supreme good fortune.', textCn: '讼，元吉。' },
      { position: 6, text: 'Even if by chance a leather belt is bestowed on one, by the end of a morning it will have been snatched away three times.', textCn: '或锡之鞶带，终朝三褫之。' },
    ],
    category: 'Growth & Transition',
  },
  {
    number: 7,
    name: 'The Army',
    nameCn: '地水师',
    pinyin: 'Dì Shuǐ Shī',
    judgment: 'The Army. The army needs perseverance and a strong man. Good fortune without blame.',
    judgmentCn: '贞，丈人吉，无咎。',
    image: 'In the middle of the earth is water: the image of the Army. Thus the superior man enriches his character through patient self-cultivation.',
    imageCn: '地中有水，师。君子以容民畜众。',
    upperTrigram: 0,
    lowerTrigram: 2,
    lines: [
      { position: 1, text: 'An army must set forth in proper order. If the order is not good, misfortune threatens.', textCn: '师出以律，否臧凶。' },
      { position: 2, text: 'In the midst of the army. Good fortune. No blame. The king bestows three decorations.', textCn: '在师中吉，无咎，王三锡命。' },
      { position: 3, text: 'The army has misfortune. The leader is killed by defeat.', textCn: '师或舆尸，凶。' },
      { position: 4, text: 'The army retreats. No blame.', textCn: '师左次，无咎。' },
      { position: 5, text: 'There are game birds in the fields. It furthers to catch them. No blame. Let the eldest son lead the army; if the younger son is in charge, misfortune follows, even if he is persevering.', textCn: '田有禽，利执言，无咎。长子帅师，弟子舆尸，贞凶。' },
      { position: 6, text: 'The great prince issues commands, founds states, and ennobles families. Do not employ inferior men.', textCn: '大君有命，开国承家，小人勿用。' },
    ],
    category: 'Order & Governance',
  },
  {
    number: 8,
    name: 'Holding Together',
    nameCn: '水地比',
    pinyin: 'Shuǐ Dì Bǐ',
    judgment: 'Holding Together brings good fortune. Inquire of the oracle whether you possess sublimity, greatness, and unswerving perseverance; then you are without blame. Those who are not sure will gradually come. He who comes late meets with misfortune.',
    judgmentCn: '吉。原筮元永贞，无咎。不宁方来，后夫凶。',
    image: 'On the earth is water: the image of Holding Together. Thus the kings of antiquity gave fiefs to feudal princes and remained friendly with the feudal lords.',
    imageCn: '地上有水，比。先王以建万国，亲诸侯。',
    upperTrigram: 2,
    lowerTrigram: 0,
    lines: [
      { position: 1, text: 'Holding Together at the beginning brings no blame. If one is sincere, and full of devotion, no blame. If one lacks sincerity, there will be misfortune.', textCn: '有孚比之，无咎。有孚盈缶，终来有它吉。' },
      { position: 2, text: 'Holding Together with inward sincerity. Perseverance brings good fortune.', textCn: '比之自内，贞吉。' },
      { position: 3, text: 'One holds together with those who are not good.', textCn: '比之匪人。' },
      { position: 4, text: 'Holding Together with those outside. Perseverance brings good fortune.', textCn: '外比之，贞吉。' },
      { position: 5, text: 'The most sincere form of Holding Together. All sides agree. The king approaches his game from three sides and lets those escape before him. The people of his realm are not on their guard. Good fortune.', textCn: '显比，王用三驱，失前禽，邑人不诫，吉。' },
      { position: 6, text: 'Holding Together with the head, but there is no leader. Misfortune.', textCn: '比之无首，凶。' },
    ],
    category: 'Order & Governance',
  },
  {
    number: 9,
    name: 'The Taming Power of the Small',
    nameCn: '风天小畜',
    pinyin: 'Fēng Tiān Xiǎo Xù',
    judgment: 'The Taming Power of the Small has success. Dense clouds, no rain from our western region.',
    judgmentCn: '亨。密云不雨，自我西郊。',
    image: 'Wind driven across the sky: the image of the Taming Power of the Small. Thus the superior man refines the outward aspect of his nature.',
    imageCn: '风行天上，小畜。君子以懿文德。',
    upperTrigram: 3,
    lowerTrigram: 7,
    lines: [
      { position: 1, text: 'Return to the way. How could there be blame in this? Good fortune.', textCn: '复自道，何其咎，吉。' },
      { position: 2, text: 'One is led back by the hand. Good fortune.', textCn: '牵复，吉。' },
      { position: 3, text: 'The spokes burst out of the wheel hubs. Man and wife roll their eyes at each other.', textCn: '舆说辐，夫妻反目。' },
      { position: 4, text: 'If you are sincere, blood vanishes and fear gives way. No blame.', textCn: '有孚，血去惕出，无咎。' },
      { position: 5, text: 'If you are sincere and loyally attached, you are rich in your neighbor.', textCn: '有孚挛如，富以其邻。' },
      { position: 6, text: 'The rain comes, the rain ceases. One should be as sincere as the circle of virtue. Then, like a woman whose husband is away, one must remain persevering. The moon is nearly full. If the superior man undertakes something, misfortune comes.', textCn: '既雨既处，尚德载，妇贞厉。月几望，君子征凶。' },
    ],
    category: 'Growth & Transition',
  },
  {
    number: 10,
    name: 'Treading',
    nameCn: '天泽履',
    pinyin: 'Tiān Zé Lǚ',
    judgment: 'Treading on the tail of a tiger. It does not bite you. Success.',
    judgmentCn: '履虎尾，不咥人，亨。',
    image: 'Heaven above, the lake below: the image of Treading. Thus the superior man discriminates between high and low, and thus fortifies the thinking of the people.',
    imageCn: '上天下泽，履。君子以辨上下，定民志。',
    upperTrigram: 7,
    lowerTrigram: 6,
    lines: [
      { position: 1, text: 'Simple conduct. Progress without blame.', textCn: '素履，往无咎。' },
      { position: 2, text: 'Treading a smooth, level course. The perseverance of a dark man brings good fortune.', textCn: '履道坦坦，幽人贞吉。' },
      { position: 3, text: 'A one-eyed man is able to see, a lame man is able to tread. He treads on the tail of the tiger, and the tiger bites him. Misfortune. Thus the warrior acts as a great prince.', textCn: '眇能视，跛能履，履虎尾，咥人凶。武人为于大君。' },
      { position: 4, text: 'He treads on the tail of the tiger. Caution and care lead to good fortune in the end.', textCn: '履虎尾，愬愬终吉。' },
      { position: 5, text: 'Resolute conduct. Perseverance in the face of danger.', textCn: '夬履，贞厉。' },
      { position: 6, text: 'Look to your conduct and weigh the favorable circumstances. If they are perfectly balanced, supreme good fortune comes.', textCn: '视履考祥，其旋元吉。' },
    ],
    category: 'Growth & Transition',
  },
  // 11-64 卦将在完整版本中实现，这里提供前10卦作为MVP演示数据
  // 其余54卦使用算法生成的简化版本
]

// 为剩余54卦生成简化数据（MVP期使用）
function generateRemainingHexagrams(): Hexagram[] {
  const remaining: Hexagram[] = []
  
  // 八卦两两组合生成64卦的卦名
  const trigramRelations: Record<string, { name: string; nameCn: string; pinyin: string; category: string }> = {
    '7-7': { name: 'Creative Heaven', nameCn: '乾为天', pinyin: 'Qián', category: 'Heaven & Earth' },
    '7-6': { name: 'Treading', nameCn: '天泽履', pinyin: 'Lǚ', category: 'Growth & Transition' },
    '7-5': { name: 'Great Possessing', nameCn: '天火同人', pinyin: 'Tóng Rén', category: 'Community' },
    '7-4': { name: 'Great Power', nameCn: '天雷大壮', pinyin: 'Dà Zhuàng', category: 'Power' },
    '7-3': { name: 'Small Taming', nameCn: '天风姤', pinyin: 'Gòu', category: 'Relationship' },
    '7-2': { name: 'Conflict', nameCn: '天水讼', pinyin: 'Sòng', category: 'Growth & Transition' },
    '7-1': { name: 'Retreat', nameCn: '天山遁', pinyin: 'Dùn', category: 'Order & Governance' },
    '7-0': { name: 'Peace', nameCn: '天地否', pinyin: 'Pǐ', category: 'Heaven & Earth' },
    '6-7': { name: 'Breakthrough', nameCn: '泽天夬', pinyin: 'Guài', category: 'Power' },
    '6-6': { name: 'The Joyous', nameCn: '兑为泽', pinyin: 'Duì', category: 'Joy' },
    '6-5': { name: 'Revolution', nameCn: '泽火革', pinyin: 'Gé', category: 'Change' },
    '6-4': { name: 'Great Harvest', nameCn: '泽雷随', pinyin: 'Suí', category: 'Community' },
    '6-3': { name: 'Inner Truth', nameCn: '泽风大过', pinyin: 'Dà Guò', category: 'Relationship' },
    '6-2': { name: 'Oppression', nameCn: '泽水困', pinyin: 'Kùn', category: 'Difficulty' },
    '6-1': { name: 'Decrease', nameCn: '泽山咸', pinyin: 'Xián', category: 'Relationship' },
    '6-0': { name: 'Gathering', nameCn: '泽地萃', pinyin: 'Cuì', category: 'Community' },
    '5-7': { name: 'Great People', nameCn: '火天大有', pinyin: 'Dà Yǒu', category: 'Abundance' },
    '5-6': { name: 'The Wanderer', nameCn: '火泽睽', pinyin: 'Kuí', category: 'Difficulty' },
    '5-5': { name: 'The Clinging', nameCn: '离为火', pinyin: 'Lí', category: 'Fire & Light' },
    '5-4': { name: 'Abundance', nameCn: '火雷噬嗑', pinyin: 'Shì Hé', category: 'Justice' },
    '5-3': { name: 'The Family', nameCn: '风火家人', pinyin: 'Jiā Rén', category: 'Relationship' },
    '5-2': { name: 'After Completion', nameCn: '水火既济', pinyin: 'Jì Jì', category: 'Completion' },
    '5-1': { name: 'The Wanderer', nameCn: '火山旅', pinyin: 'Lǚ', category: 'Travel' },
    '5-0': { name: 'Emptiness', nameCn: '火地晋', pinyin: 'Jìn', category: 'Growth & Transition' },
    '4-7': { name: 'Innocence', nameCn: '雷天大壮', pinyin: 'Dà Zhuàng', category: 'Power' },
    '4-6': { name: 'Enthusiasm', nameCn: '雷泽归妹', pinyin: 'Guī Mèi', category: 'Relationship' },
    '4-5': { name: 'Food', nameCn: '雷火丰', pinyin: 'Fēng', category: 'Abundance' },
    '4-4': { name: 'The Arousing', nameCn: '震为雷', pinyin: 'Zhèn', category: 'Shock & Awe' },
    '4-3': { name: 'Increase', nameCn: '雷风恒', pinyin: 'Héng', category: 'Duration' },
    '4-2': { name: 'Excitement', nameCn: '雷水解', pinyin: 'Jiě', category: 'Release' },
    '4-1': { name: 'The Marrying Maiden', nameCn: '雷山小过', pinyin: 'Xiǎo Guò', category: 'Humility' },
    '4-0': { name: 'Approach', nameCn: '雷地豫', pinyin: 'Yù', category: 'Enthusiasm' },
    '3-7': { name: 'Coming to Meet', nameCn: '风天小畜', pinyin: 'Xiǎo Xù', category: 'Growth & Transition' },
    '3-6': { name: 'Dawn', nameCn: '风泽中孚', pinyin: 'Zhōng Fú', category: 'Inner Truth' },
    '3-5': { name: 'The Cauldron', nameCn: '风火鼎', pinyin: 'Dǐng', category: 'Transformation' },
    '3-4': { name: 'Great Increase', nameCn: '风雷益', pinyin: 'Yì', category: 'Growth & Transition' },
    '3-3': { name: 'The Gentle', nameCn: '巽为风', pinyin: 'Xùn', category: 'Penetration' },
    '3-2': { name: 'Dispersion', nameCn: '风水涣', pinyin: 'Huàn', category: 'Dissolution' },
    '3-1': { name: 'Gradual Progress', nameCn: '风山渐', pinyin: 'Jiàn', category: 'Growth & Transition' },
    '3-0': { name: 'View', nameCn: '风地观', pinyin: 'Guān', category: 'Contemplation' },
    '2-7': { name: 'The Waiting', nameCn: '水天需', pinyin: 'Xū', category: 'Growth & Transition' },
    '2-6': { name: 'Exhaustion', nameCn: '水泽节', pinyin: 'Jié', category: 'Limitation' },
    '2-5': { name: 'The Abysmal', nameCn: '水火未济', pinyin: 'Wèi Jì', category: 'Incompletion' },
    '2-4': { name: 'Relief', nameCn: '水雷屯', pinyin: 'Zhūn', category: 'Growth & Transition' },
    '2-3': { name: 'The Well', nameCn: '水风井', pinyin: 'Jǐng', category: 'Nourishment' },
    '2-2': { name: 'The Abysmal', nameCn: '坎为水', pinyin: 'Kǎn', category: 'Water & Depth' },
    '2-1': { name: 'Obstruction', nameCn: '水山蹇', pinyin: 'Jiǎn', category: 'Difficulty' },
    '2-0': { name: 'The Army', nameCn: '水地比', pinyin: 'Bǐ', category: 'Order & Governance' },
    '1-7': { name: 'Retreat', nameCn: '山天大畜', pinyin: 'Dà Xù', category: 'Nourishment' },
    '1-6': { name: 'Modesty', nameCn: '山泽损', pinyin: 'Sǔn', category: 'Decrease' },
    '1-5': { name: 'The Mountain', nameCn: '山火贲', pinyin: 'Bì', category: 'Grace' },
    '1-4': { name: 'Youthful Folly', nameCn: '山雷颐', pinyin: 'Yí', category: 'Nourishment' },
    '1-3': { name: 'Great Taming', nameCn: '山风蛊', pinyin: 'Gǔ', category: 'Decay' },
    '1-2': { name: 'The Standstill', nameCn: '山水蒙', pinyin: 'Méng', category: 'Growth & Transition' },
    '1-1': { name: 'Keeping Still', nameCn: '艮为山', pinyin: 'Gèn', category: 'Stillness' },
    '1-0': { name: 'Ascent', nameCn: '山地剥', pinyin: 'Bō', category: 'Decline' },
    '0-7': { name: 'Standstill', nameCn: '地天泰', pinyin: 'Tài', category: 'Heaven & Earth' },
    '0-6': { name: 'Receptivity', nameCn: '地泽临', pinyin: 'Lín', category: 'Approach' },
    '0-5': { name: 'Darkness', nameCn: '地火明夷', pinyin: 'Míng Yí', category: 'Adversity' },
    '0-4': { name: 'Enthusiasm', nameCn: '地雷复', pinyin: 'Fù', category: 'Return' },
    '0-3': { name: 'Contemplation', nameCn: '地风升', pinyin: 'Shēng', category: 'Growth & Transition' },
    '0-2': { name: 'The Receptive', nameCn: '地水师', pinyin: 'Shī', category: 'Order & Governance' },
    '0-1': { name: 'Decline', nameCn: '地山谦', pinyin: 'Qiān', category: 'Humility' },
    '0-0': { name: 'Receptive Earth', nameCn: '坤为地', pinyin: 'Kūn', category: 'Heaven & Earth' },
  }
  
  // 生成64卦完整数据
  for (let upper = 0; upper < 8; upper++) {
    for (let lower = 0; lower < 8; lower++) {
      const key = `${upper}-${lower}`
      const info = trigramRelations[key]
      
      // 计算卦序号（按周易顺序的简化映射）
      // 实际的周易顺序比较复杂，这里使用一个简化的映射
      const number = upper * 8 + lower + 1
      
      // 如果在前10卦中已定义，跳过
      const existing = SIXTY_FOUR_HEXAGRAMS.find(h => h.upperTrigram === upper && h.lowerTrigram === lower)
      if (existing) continue
      
      const upperTrigram = EIGHT_TRIGRAMS.find(t => t.id === upper)!
      const lowerTrigram = EIGHT_TRIGRAMS.find(t => t.id === lower)!
      
      // 生成6个爻辞（简化版）
      const lines: HexagramLine[] = []
      const yangTexts = [
        { en: 'Firm and correct at the beginning. Good fortune through proper action.', cn: '初爻坚正，行事得吉。' },
        { en: 'Centered and balanced. One finds allies in the middle way.', cn: '中正之道，得朋相助。' },
        { en: 'Active and creating. Creative energy flows through.', cn: '动而有创，生气勃发。' },
        { en: 'Steady progress. Gradual advancement brings results.', cn: '稳步前行，渐有所成。' },
        { en: 'In the place of power. Great responsibility with grace.', cn: '居尊位，怀大任。' },
        { en: 'At the peak. Know when to pause or change course.', cn: '至极而变，知止不殆。' },
      ]
      const yinTexts = [
        { en: 'Humble beginning. Listening and learning.', cn: '谦下起始，聆听学习。' },
        { en: 'Receptive and open. Inner strength shows through.', cn: '虚怀若谷，内含力量。' },
        { en: 'Supportive role. Great help from behind the scenes.', cn: '默默支持，暗中有力。' },
        { en: 'Caution and care. Proper boundaries protect.', cn: '谨慎小心，守界得安。' },
        { en: 'Grace and yielding. Softness overcomes hardness.', cn: '柔顺谦下，柔可克刚。' },
        { en: 'Completion and return. The cycle turns anew.', cn: '终而复始，循环不息。' },
      ]
      
      for (let pos = 1; pos <= 6; pos++) {
        const isYang = pos <= 3 ? lowerTrigram.binary[pos - 1] === 1 : upperTrigram.binary[pos - 4] === 1
        const text = isYang ? yangTexts[pos - 1] : yinTexts[pos - 1]
        lines.push({
          position: pos,
          text: text.en,
          textCn: text.cn,
        })
      }
      
      remaining.push({
        number,
        name: info.name,
        nameCn: info.nameCn,
        pinyin: info.pinyin,
        judgment: `The hexagram of ${info.name}. The interaction between ${upperTrigram.name} and ${lowerTrigram.name} reveals the pattern at play in your situation.`,
        judgmentCn: `${info.nameCn}之卦。${upperTrigram.nameCn}${lowerTrigram.nameCn}相交，显示当前局势之格局。`,
        image: `The image of ${upperTrigram.name} above ${lowerTrigram.name}. Thus the superior man reflects on this pattern and acts accordingly.`,
        imageCn: `${upperTrigram.nameCn}${lowerTrigram.nameCn}之象。君子观此卦象，顺势而为。`,
        upperTrigram: upper,
        lowerTrigram: lower,
        lines,
        category: info.category,
      })
    }
  }
  
  return remaining
}

// 合并所有64卦
export const ALL_HEXAGRAMS: Hexagram[] = [
  ...SIXTY_FOUR_HEXAGRAMS,
  ...generateRemainingHexagrams(),
].sort((a, b) => a.number - b.number)

// 去重
const seen = new Set<number>()
export const HEXAGRAMS: Hexagram[] = ALL_HEXAGRAMS.filter(h => {
  if (seen.has(h.number)) return false
  seen.add(h.number)
  return true
})

// 获取卦象（按编号1-64）
export function getHexagramByNumber(number: number): Hexagram | undefined {
  return HEXAGRAMS.find(h => h.number === number)
}

// 根据上下卦获取卦象
export function getHexagramByTrigrams(upper: number, lower: number): Hexagram | undefined {
  return HEXAGRAMS.find(h => h.upperTrigram === upper && h.lowerTrigram === lower)
}

// 根据六爻获取卦象 (bottom to top, 6 lines, 1=yang, 0=yin)
export function getHexagramByLines(lines: number[]): Hexagram | undefined {
  if (lines.length !== 6) return undefined
  
  const lowerBinary = lines.slice(0, 3)
  const upperBinary = lines.slice(3, 6)
  
  const lowerId = lowerBinary[0] * 4 + lowerBinary[1] * 2 + lowerBinary[2]
  const upperId = upperBinary[0] * 4 + upperBinary[1] * 2 + upperBinary[2]
  
  return getHexagramByTrigrams(upperId, lowerId)
}

// 获取变卦
export function getChangedHexagram(originalLines: number[], changingLines: number[]): {
  hexagram: Hexagram | undefined
  changedLines: number[]
} {
  const newLines = [...originalLines]
  
  changingLines.forEach(pos => {
    // position is 1-6 (bottom to top), index is 0-5
    const index = pos - 1
    if (index >= 0 && index < 6) {
      newLines[index] = newLines[index] === 1 ? 0 : 1
    }
  })
  
  return {
    hexagram: getHexagramByLines(newLines),
    changedLines: newLines,
  }
}
