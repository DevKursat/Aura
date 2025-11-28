export interface ImageGenerationInput {
  prompt: string
  size?: '512x512' | '1024x1024' | '1024x768' | '768x1024'
  style?: 'realistic' | 'artistic' | 'fantasy'
}

export interface ImageGenerationOutput {
  url: string
  width: number
  height: number
}

export async function generateImage(
  params: ImageGenerationInput
): Promise<ImageGenerationOutput> {
  const { prompt, size = '1024x1024', style = 'fantasy' } = params

  const enhancedPrompt = `${prompt}, ${style} style, high quality, detailed`

  const response = await fetch('https://fal.run/fal-ai/flux-pro', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${process.env.FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: enhancedPrompt,
      image_size: size,
      num_inference_steps: 28,
      guidance_scale: 3.5,
      num_images: 1,
      enable_safety_checker: true,
    }),
  })

  if (!response.ok) {
    throw new Error(`Image generation failed: ${response.statusText}`)
  }

  const data = await response.json()
  
  const [width, height] = size.split('x').map(Number)

  return {
    url: data.images?.[0]?.url || '',
    width,
    height,
  }
}

// Generate dream visualization
export async function generateDreamImage(
  dreamContent: string,
  symbols: string[],
  emotions: string[]
): Promise<ImageGenerationOutput> {
  const symbolsText = symbols.slice(0, 5).join(', ')
  const emotionsText = emotions.slice(0, 3).join(', ')

  const prompt = `Surreal dreamscape visualization: ${dreamContent.slice(0, 200)}. 
    Key elements: ${symbolsText}. 
    Mood: ${emotionsText}. 
    Style: ethereal, mystical, soft colors, fantasy illustration, magical atmosphere, floating elements, cosmic background`

  return generateImage({ prompt, style: 'fantasy' })
}

// Generate fortune reading visualization
export async function generateFortuneImage(
  fortuneType: string,
  highlights: string[]
): Promise<ImageGenerationOutput> {
  const fortuneStyles: Record<string, string> = {
    coffee: 'mystical coffee cup with swirling patterns, steam forming magical symbols, turkish oriental style',
    tarot: 'glowing tarot cards floating in cosmic space, mystical symbols, celestial background',
    palm: 'ethereal glowing hand with illuminated palm lines, cosmic energy flowing',
    face: 'mystical portrait with visible aura, spiritual energy visualization',
    astrology: 'cosmic zodiac wheel with planets, celestial map, stars and constellations',
    dream: 'surreal floating dreamscape, clouds, moon phases, fantasy elements',
  }

  const style = fortuneStyles[fortuneType] || fortuneStyles.astrology
  const highlightsText = highlights.slice(0, 3).join(', ')

  const prompt = `${style}. Key themes: ${highlightsText}. 
    Style: digital art, ethereal glow, magical atmosphere, high detail, mystical fantasy illustration`

  return generateImage({ prompt, style: 'fantasy' })
}
