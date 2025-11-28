import Anthropic from '@anthropic-ai/sdk'
import type { FortuneType } from '@/lib/supabase/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

// Fortune reading prompts
const fortunePrompts: Record<FortuneType, (input: Record<string, unknown>, language: string) => string> = {
  coffee: (input, lang) => {
    const intro = lang === 'tr' 
      ? 'Sen deneyimli bir kahve falı uzmanısın. Fincan görüntüsünü analiz et ve mistik, etkileyici bir yorum yap.'
      : 'You are an experienced coffee fortune teller. Analyze the cup image and provide a mystical, engaging reading.'
    
    return `${intro}

${lang === 'tr' ? 'Kullanıcı hakkında bilgiler' : 'User information'}:
- ${lang === 'tr' ? 'İsim' : 'Name'}: ${input.userName || (lang === 'tr' ? 'Bilinmiyor' : 'Unknown')}
- ${lang === 'tr' ? 'Burç' : 'Zodiac'}: ${input.zodiacSign || (lang === 'tr' ? 'Bilinmiyor' : 'Unknown')}

${lang === 'tr' ? `
Yorum şu bölümlerden oluşmalı:
1. **Genel Bakış**: Fincandaki genel enerji ve atmosfer
2. **Aşk ve İlişkiler**: Duygusal yaşam hakkında
3. **Kariyer ve Para**: İş ve finansal konular
4. **Sağlık**: Fiziksel ve ruhsal sağlık
5. **Uyarılar ve Öneriler**: Dikkat edilmesi gerekenler
6. **Öne Çıkan Semboller**: Gördüğün önemli şekillerin anlamları

Gizemli, samimi ve umut verici bir dil kullan. Her bölümü 2-3 cümle ile açıkla.
` : `
The reading should include these sections:
1. **Overview**: General energy and atmosphere in the cup
2. **Love & Relationships**: About emotional life
3. **Career & Money**: Work and financial matters
4. **Health**: Physical and spiritual wellbeing
5. **Warnings & Advice**: Things to be aware of
6. **Key Symbols**: Meanings of important shapes you see

Use a mystical, warm, and hopeful tone. Explain each section in 2-3 sentences.
`}`
  },

  tarot: (input, lang) => {
    const cards = (input.cards as Array<{ name: string; reversed: boolean }>) || []
    const cardList = cards.map(c => `${c.name}${c.reversed ? ' (Reversed)' : ''}`).join(', ')
    
    return lang === 'tr' 
      ? `Sen bilge bir tarot ustasısın. Şu kartları yorumla: ${cardList}

Açılım türü: ${input.spreadType || 'Üç Kart'}
Kullanıcı sorusu: ${input.question || 'Genel yorum'}

Her kart için derin bir anlam çıkar ve kartların birbiriyle ilişkisini açıkla. Mistik ama anlaşılır bir dil kullan. Geçmiş-şimdi-gelecek bağlantısını kur.`
      : `You are a wise tarot master. Interpret these cards: ${cardList}

Spread type: ${input.spreadType || 'Three Card'}
User's question: ${input.question || 'General reading'}

Extract deep meaning from each card and explain how they relate to each other. Use mystical but understandable language. Connect past-present-future.`
  },

  palm: (input, lang) => {
    return lang === 'tr'
      ? `Sen uzman bir el falı okuyucususun. Kullanıcının el fotoğrafını analiz et.

Şu çizgileri yorumla:
1. **Yaşam Çizgisi**: Sağlık ve yaşam enerjisi
2. **Kalp Çizgisi**: Aşk ve duygusal yaşam
3. **Kader Çizgisi**: Kariyer ve yaşam yolu
4. **Akıl Çizgisi**: Zihinsel yetenekler ve düşünce tarzı

Ayrıca el şeklini, parmak uzunluklarını ve avuç içi dokusunu da değerlendir. Detaylı ve kişiselleştirilmiş bir yorum yap.`
      : `You are an expert palmist. Analyze the user's palm photo.

Interpret these lines:
1. **Life Line**: Health and vital energy
2. **Heart Line**: Love and emotional life
3. **Fate Line**: Career and life path
4. **Head Line**: Mental abilities and thinking style

Also evaluate hand shape, finger lengths, and palm texture. Provide a detailed and personalized reading.`
  },

  face: (input, lang) => {
    return lang === 'tr'
      ? `Sen deneyimli bir fizyonomi (yüz falı) uzmanısın. Kullanıcının yüz özelliklerini analiz et.

Şunları değerlendir:
1. **Alın**: Zeka ve düşünce kapasitesi
2. **Gözler**: Ruh ve iç dünya
3. **Burun**: Karakter ve irade gücü
4. **Ağız ve Dudaklar**: İletişim ve duygusal ifade
5. **Çene**: Kararlılık ve azim
6. **Genel Uyum**: Yüz oranları ve denge

Kişilik özellikleri, güçlü yanlar ve gelişim alanları hakkında içgörü sun.`
      : `You are an experienced physiognomist (face reader). Analyze the user's facial features.

Evaluate:
1. **Forehead**: Intelligence and thought capacity
2. **Eyes**: Soul and inner world
3. **Nose**: Character and willpower
4. **Mouth & Lips**: Communication and emotional expression
5. **Chin**: Determination and perseverance
6. **Overall Harmony**: Face proportions and balance

Provide insights about personality traits, strengths, and areas for growth.`
  },

  astrology: (input, lang) => {
    return lang === 'tr'
      ? `Sen uzman bir astrologsun. Kullanıcının doğum haritasını yorumla.

Doğum bilgileri:
- Tarih: ${input.birthDate || 'Bilinmiyor'}
- Saat: ${input.birthTime || 'Bilinmiyor'}
- Yer: ${input.birthPlace || 'Bilinmiyor'}

Güneş, Ay ve Yükselen burçları analiz et. Gezegen konumlarını ve ev sistemini değerlendir. Kişilik özellikleri, yaşam temaları ve potansiyel zorluklar hakkında detaylı bir analiz sun.`
      : `You are an expert astrologer. Interpret the user's birth chart.

Birth information:
- Date: ${input.birthDate || 'Unknown'}
- Time: ${input.birthTime || 'Unknown'}
- Place: ${input.birthPlace || 'Unknown'}

Analyze Sun, Moon, and Rising signs. Evaluate planetary positions and house system. Provide detailed analysis about personality traits, life themes, and potential challenges.`
  },

  horoscope: (input, lang) => {
    const sign = input.zodiacSign || 'aries'
    return lang === 'tr'
      ? `Sen deneyimli bir astrologsun. ${sign} burcu için bugünün yorumunu yaz.

Şu alanları kapsayacak detaylı bir günlük burç yorumu hazırla:
1. **Genel**: Günün enerjisi ve atmosferi
2. **Aşk**: Romantik ilişkiler ve duygular
3. **Kariyer**: İş ve profesyonel yaşam
4. **Sağlık**: Fiziksel ve mental iyilik hali
5. **Finans**: Para ve maddi konular

Ayrıca şans sayısı, şanslı renk ve en uyumlu burcu belirt. Pozitif ve motive edici bir dil kullan.`
      : `You are an experienced astrologer. Write today's horoscope for ${sign}.

Prepare a detailed daily horoscope covering:
1. **General**: Day's energy and atmosphere
2. **Love**: Romantic relationships and emotions
3. **Career**: Work and professional life
4. **Health**: Physical and mental wellbeing
5. **Finance**: Money and material matters

Also specify lucky number, lucky color, and most compatible sign. Use positive and motivating language.`
  },

  yildizname: (input, lang) => {
    return lang === 'tr'
      ? `Sen kadim yıldızname ilminde uzman bir alimsin. Kullanıcının doğum anındaki gök haritasını ve Osmanlı/İslami astroloji geleneğine göre yıldıznamesini hazırla.

Doğum bilgileri:
- Tarih: ${input.birthDate || 'Bilinmiyor'}
- Saat: ${input.birthTime || 'Bilinmiyor'}
- Yer: ${input.birthPlace || 'Bilinmiyor'}

Şunları içermeli:
1. Doğum yıldızı ve anlamı
2. Hayat rehberi yıldızlar
3. Karakteristik özellikler
4. Talih ve kader
5. Dikkat edilmesi gerekenler
6. Uğurlu gün, renk ve sayılar

Mistik ve geleneksel bir dil kullan.`
      : `You are a master of the ancient art of Yildizname (Ottoman/Islamic astrology). Prepare the user's birth star chart.

Birth information:
- Date: ${input.birthDate || 'Unknown'}
- Time: ${input.birthTime || 'Unknown'}
- Place: ${input.birthPlace || 'Unknown'}

Include:
1. Birth star and its meaning
2. Life guide stars
3. Character traits
4. Fortune and destiny
5. Warnings
6. Lucky days, colors, and numbers

Use mystical and traditional language.`
  },

  dream: (input, lang) => {
    return lang === 'tr'
      ? `Sen deneyimli bir rüya yorumcususun. Kullanıcının rüyasını analiz et.

Rüya içeriği:
${input.dreamContent || 'Rüya açıklaması verilmedi'}

Rüyadaki semboller: ${(input.symbols as string[])?.join(', ') || 'Belirtilmedi'}
Duygular: ${(input.emotions as string[])?.join(', ') || 'Belirtilmedi'}

Şunları analiz et:
1. **Genel Yorum**: Rüyanın ana mesajı
2. **Sembol Analizi**: Her sembolün anlamı
3. **Psikolojik Boyut**: Bilinçaltı mesajlar
4. **Pratik Öneriler**: Günlük hayata yansımaları
5. **Gelecek İşaretleri**: Olası öngörüler

Derin ve içgörülü bir yorum sun.`
      : `You are an experienced dream interpreter. Analyze the user's dream.

Dream content:
${input.dreamContent || 'No dream description provided'}

Symbols in dream: ${(input.symbols as string[])?.join(', ') || 'Not specified'}
Emotions: ${(input.emotions as string[])?.join(', ') || 'Not specified'}

Analyze:
1. **General Interpretation**: Main message of the dream
2. **Symbol Analysis**: Meaning of each symbol
3. **Psychological Dimension**: Subconscious messages
4. **Practical Advice**: Reflections for daily life
5. **Future Signs**: Possible predictions

Provide deep and insightful interpretation.`
  },

  numerology: (input, lang) => {
    return lang === 'tr'
      ? `Sen uzman bir numerologsun. Kullanıcının sayılarını analiz et.

Bilgiler:
- İsim: ${input.fullName || 'Bilinmiyor'}
- Doğum tarihi: ${input.birthDate || 'Bilinmiyor'}

Şunları hesapla ve yorumla:
1. **Yaşam Yolu Sayısı**: Ana yaşam amacı
2. **Kişilik Sayısı**: Dışa yansıyan kişilik
3. **Ruh Dürtüsü Sayısı**: İç motivasyonlar
4. **Kader Sayısı**: Yaşam dersleri
5. **Kişisel Yıl**: Bu yılın enerjisi

Her sayının detaylı anlamını ve hayata etkisini açıkla.`
      : `You are an expert numerologist. Analyze the user's numbers.

Information:
- Name: ${input.fullName || 'Unknown'}
- Birth date: ${input.birthDate || 'Unknown'}

Calculate and interpret:
1. **Life Path Number**: Main life purpose
2. **Personality Number**: Outer personality
3. **Soul Urge Number**: Inner motivations
4. **Destiny Number**: Life lessons
5. **Personal Year**: This year's energy

Explain detailed meaning of each number and its life impact.`
  },

  love_match: (input, lang) => {
    return lang === 'tr'
      ? `Sen ilişki ve aşk uyumu uzmanısın. İki kişinin uyumunu analiz et.

Kişi 1:
- Burç: ${input.person1Zodiac || 'Bilinmiyor'}
- Doğum: ${input.person1BirthDate || 'Bilinmiyor'}

Kişi 2:
- Burç: ${input.person2Zodiac || 'Bilinmiyor'}
- Doğum: ${input.person2BirthDate || 'Bilinmiyor'}

Şunları değerlendir:
1. **Genel Uyum**: Yüzde ve genel değerlendirme
2. **Duygusal Uyum**: Hisler ve bağlılık
3. **İletişim**: Anlayış ve ifade
4. **Tutku**: Fiziksel çekim
5. **Uzun Vadeli Potansiyel**: Gelecek tahmini
6. **Tavsiyeler**: İlişkiyi güçlendirmek için

Romantik ve umut verici ama gerçekçi ol.`
      : `You are a relationship and love compatibility expert. Analyze the compatibility of two people.

Person 1:
- Zodiac: ${input.person1Zodiac || 'Unknown'}
- Birth: ${input.person1BirthDate || 'Unknown'}

Person 2:
- Zodiac: ${input.person2Zodiac || 'Unknown'}
- Birth: ${input.person2BirthDate || 'Unknown'}

Evaluate:
1. **Overall Compatibility**: Percentage and assessment
2. **Emotional Compatibility**: Feelings and bonding
3. **Communication**: Understanding and expression
4. **Passion**: Physical attraction
5. **Long-term Potential**: Future prediction
6. **Advice**: To strengthen the relationship

Be romantic and hopeful but realistic.`
  },
}

export interface FortuneReadingInput {
  type: FortuneType
  input: Record<string, unknown>
  language: 'tr' | 'en'
  userId: string
}

export interface FortuneReadingOutput {
  text: string
  summary: string
  highlights: string[]
}

export async function generateFortuneReading(
  params: FortuneReadingInput
): Promise<FortuneReadingOutput> {
  const { type, input, language } = params

  const promptGenerator = fortunePrompts[type]
  if (!promptGenerator) {
    throw new Error(`Unknown fortune type: ${type}`)
  }

  const prompt = promptGenerator(input, language)

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const responseText = message.content[0].type === 'text' 
    ? message.content[0].text 
    : ''

  // Extract summary (first paragraph)
  const paragraphs = responseText.split('\n\n').filter(p => p.trim())
  const summary = paragraphs[0]?.slice(0, 200) + '...' || ''

  // Extract highlights (look for bold sections)
  const highlights = responseText
    .match(/\*\*([^*]+)\*\*/g)
    ?.map(h => h.replace(/\*\*/g, ''))
    ?.slice(0, 5) || []

  return {
    text: responseText,
    summary,
    highlights,
  }
}

// Generate image prompt for fortune visualization
export function generateImagePrompt(
  type: FortuneType,
  highlights: string[],
  language: 'tr' | 'en'
): string {
  const baseStyle = 'mystical, ethereal, cosmic, digital art, fantasy illustration, soft glow, magical atmosphere'
  
  const typeStyles: Record<FortuneType, string> = {
    coffee: 'turkish coffee cup, swirling patterns, mystical symbols, steam, oriental patterns',
    tarot: 'tarot cards, mystical symbols, cosmic background, celestial, medieval art style',
    palm: 'glowing palm lines, mystical hand, cosmic energy, spiritual',
    face: 'ethereal portrait, aura colors, spiritual energy, mystical glow',
    astrology: 'zodiac wheel, planets, stars, cosmic, celestial map',
    horoscope: 'zodiac constellation, starry sky, cosmic energy',
    yildizname: 'ottoman art, islamic geometry, stars, celestial, traditional patterns',
    dream: 'surreal dreamscape, floating objects, clouds, moon, fantasy',
    numerology: 'sacred geometry, glowing numbers, mathematical patterns, cosmic',
    love_match: 'two souls, hearts, cosmic connection, romantic, ethereal',
  }

  const highlightText = highlights.slice(0, 3).join(', ')

  return `${typeStyles[type]}, ${highlightText}, ${baseStyle}`
}
